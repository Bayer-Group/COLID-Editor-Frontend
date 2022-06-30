import { ConsumerGroupResultDTO } from '../shared/models/consumerGroups/consumer-group-result-dto';
import { Selector, State, StateContext, Action, Store } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { ConsumerGroupApiService } from '../core/http/consumer-group.api.service';
import { UserDto } from '../shared/models/user/user-dto';
import { UserInfoApiService } from '../core/http/user-info.api.service';
import { of } from 'rxjs';
import { ColidEntrySubscriptionDto } from '../shared/models/user/colid-entry-subscription-dto';
import { ResourceOverviewState, SetSidebarSearch } from './resource-overview.state';
import { MessageConfigDto } from '../shared/models/user/message-config-dto';
import { FetchColidEntrySubscriptionNumbers } from './colid-entry-subcriber-count.state';

export class FetchUser {
    static readonly type = '[User] Fetch User';
    constructor(public id: string, public emailAddress: string) { }
}

export class ReloadUser {
    static readonly type = '[User] Reload User';
    constructor() { }
}

export class SetLastLoginEditor {
    static readonly type = '[User] Select Last Login Editor';
    constructor() { }
}

export class FetchConsumerGroupsByUser {
    static readonly type = '[User] Fetch consumerGroups by user';
    constructor() { }
}

export class SelectConsumerGroup {
    static readonly type = '[User] Select consumerGroup';
    constructor(public consumerGroupId: string) { }
}

export class SetDefaultConsumerGroupForUser {
    static readonly type = '[UserI] Set default ConsumerGroup';
    constructor(public selectedConsumerGroupId: string) { }
}

export class SetMessageConfig {
    static readonly type = '[User] Set MessageConfig';
    constructor(public messageConfig: MessageConfigDto) { }
}

export class SetSearchFilterEditor {
    static readonly type = '[User] Set search filter editor';
    constructor() { }
}

export class AddColidEntrySubscription {
    static readonly type = '[User] Add Colid Entry Subscription';
    constructor(public colidEntrySubscriptionDto: ColidEntrySubscriptionDto) { }
}

export class RemoveColidEntrySubscription {
    static readonly type = '[User] Remove Colid Entry Subscription';
    constructor(public colidEntrySubscriptionDto: ColidEntrySubscriptionDto) { }
}

export class UserInfoStateModel {
    user: UserDto;
    consumerGroups: ConsumerGroupResultDTO[];
    selectedConsumerGroupId: string;
    fetched: boolean;
}

@State<UserInfoStateModel>({
    name: 'UserInfo',
    defaults: {
        user: null,
        consumerGroups: null,
        selectedConsumerGroupId: null,
        fetched: false
    }
})

export class UserInfoState {
    constructor(private store: Store, private userInfoApiService: UserInfoApiService, private consumerGroupService: ConsumerGroupApiService) { }

    @Selector()
    public static getConsumerGroups(state: UserInfoStateModel) {
        return state.consumerGroups;
    }

    @Selector()
    public static getSelectedConsumerGroupId(state: UserInfoStateModel) {
        return state.selectedConsumerGroupId;
    }
    
    @Selector()
    public static getDefaultConsumerGroup(state: UserInfoStateModel) {
        return state.user.defaultConsumerGroup;
    }

    @Selector()
    public static getSearchFilterEditor(state: UserInfoStateModel) {
        return state.user.searchFilterEditor;
    }

    @Selector()
    public static getMessageConfig(state: UserInfoStateModel) {
        return state.user.messageConfig;
    }

    @Selector()
    public static getColidEntrySubscriptions(state: UserInfoStateModel) {
        return state.user.colidEntrySubscriptions;
    }

    @Selector()
    public static getIsFetched(state: UserInfoStateModel) {
        return state.fetched;
    }

    @Action(FetchUser)
    fetchUser({ patchState, dispatch }: StateContext<UserInfoStateModel>, { id, emailAddress }: FetchUser) {
        return this.userInfoApiService.getUser(id)
            .pipe(
                tap((res: UserDto) => {
                    const defaultConsumerGroup = res.defaultConsumerGroup;

                    if (defaultConsumerGroup != null) {
                        patchState({
                            selectedConsumerGroupId: defaultConsumerGroup.uri
                        });
                    }

                    patchState({
                        user: res
                    });
                    if (res.searchFilterEditor != null) {

                        if(res.searchFilterEditor.filterJson.searchText != null || res.searchFilterEditor.filterJson.consumerGroup != null || res.searchFilterEditor.filterJson.lastChangeUser != null || res.searchFilterEditor.filterJson.published|| res.searchFilterEditor.filterJson.draft ){

                            dispatch([new SetSidebarSearch(res.searchFilterEditor.filterJson)]).subscribe();
                        }

                    }
                }),
                catchError(err => {
                    if (err.status === 404) {
                        return this.userInfoApiService.createUser(id, emailAddress).pipe(tap((res: UserDto) => {
                            patchState({
                                user: res
                            });
                        }))
                    }
                    return of(null);
                })
            );
    }

    @Action(ReloadUser)
    reloadUser(ctx: StateContext<UserInfoStateModel>, action: ReloadUser) {
        const user = ctx.getState().user;
        ctx.dispatch(new FetchUser(user.id, user.emailAddress)).subscribe();
    }

    @Action(SetLastLoginEditor)
    setLastLoginEditor({ getState, patchState }: StateContext<UserInfoStateModel>, { }: SetLastLoginEditor) {
        const user = getState().user;
        const loginDate = new Date();
        if (user != null) {
            return this.userInfoApiService.setLastLoginEditor(user.id, loginDate).pipe(
                tap(res => {
                    user.lastLoginEditor = loginDate;
                    patchState({
                        user: user
                    });
                })
            );
        }
    }

    @Action(FetchConsumerGroupsByUser)
    fetchConsumerGroupsByUser({ patchState, getState }: StateContext<UserInfoStateModel>, { }: FetchConsumerGroupsByUser) {
        return this.consumerGroupService.getActiveEntities().pipe(tap((activeConsumerGroups: ConsumerGroupResultDTO[]) => {
            let selectedConsumerGroupId = getState().selectedConsumerGroupId;

            if (activeConsumerGroups.length > 0) {
                // Use the first consumer group as the selected one, if it has not been set yet (e.g. through from the default consumer group)
                // If it has been set before, then the selected consumer group is available in the list of active consumer groups.
                // The consumer group could be inactive or have been deleted, whiel the user had it selected as the default consumer group
                if (selectedConsumerGroupId == null) {
                    selectedConsumerGroupId = activeConsumerGroups[0].id;
                } else {
                    const activeSelectedCG = activeConsumerGroups.find(acg => acg.id === selectedConsumerGroupId);

                    if (activeSelectedCG == null) {
                        selectedConsumerGroupId = activeConsumerGroups[0].id;
                    }
                }
            }

            patchState({
                fetched: true,
                consumerGroups: activeConsumerGroups,
                selectedConsumerGroupId: selectedConsumerGroupId
            });
        }));
    }

    @Action(SelectConsumerGroup)
    SelectConsumerGroup({ patchState }: StateContext<UserInfoStateModel>, { consumerGroupId }: SelectConsumerGroup) {
        patchState({
            selectedConsumerGroupId: consumerGroupId
        });
    }

    @Action(SetDefaultConsumerGroupForUser)
    SetDefaultConsumerGroupForUser({ patchState, getState }: StateContext<UserInfoStateModel>, { selectedConsumerGroupId }: SetDefaultConsumerGroupForUser) {
        const user = getState().user;
        return this.userInfoApiService.setDefaultConsumerGroup(user.id, selectedConsumerGroupId).pipe(tap((res: UserDto) => {
            user.defaultConsumerGroup = res.defaultConsumerGroup;
            patchState({
                user: user
            });
        }));
    }

    @Action(SetMessageConfig)
    SetMessageConfig({ patchState, getState }: StateContext<UserInfoStateModel>, { messageConfig }: SetMessageConfig) {
        const user = getState().user;
        return this.userInfoApiService.setMessageConfig(user.id, messageConfig).pipe(tap((res: UserDto) => {
            user.messageConfig = res.messageConfig;
            patchState({
                user: user
            });
        }));
    }

    @Action(SetSearchFilterEditor)
    SetSearchFilterEditorForUser({ patchState, getState }: StateContext<UserInfoStateModel>, {  }: SetSearchFilterEditor) {
        const user = getState().user;
        const searchFilter = this.store.selectSnapshot(ResourceOverviewState.resourceOverviewSearch);
        searchFilter.searchText = null;

        return this.userInfoApiService.setSearchFilterEditor(user.id, searchFilter).pipe(tap((res: UserDto) => {
            user.searchFilterEditor = res.searchFilterEditor;
            patchState({
                user: user
            });
        }));
    }

    @Action(AddColidEntrySubscription)
    AddColidEntrySubscription({ patchState, getState }: StateContext<UserInfoStateModel>, { colidEntrySubscriptionDto }: AddColidEntrySubscription) {
        const user = getState().user;
        return this.userInfoApiService.addColidEntrySubscription(user.id, colidEntrySubscriptionDto).pipe(tap((res: UserDto) => {
            user.colidEntrySubscriptions = res.colidEntrySubscriptions;
            patchState({
                user: user
            });
            this.store.dispatch(new FetchColidEntrySubscriptionNumbers(colidEntrySubscriptionDto.colidPidUri))
        }));
    }

    @Action(RemoveColidEntrySubscription)
    RemoveColidEntrySubscription({ patchState, getState }: StateContext<UserInfoStateModel>, { colidEntrySubscriptionDto }: RemoveColidEntrySubscription) {
        const user = getState().user;
        return this.userInfoApiService.removeColidEntrySubscription(user.id, colidEntrySubscriptionDto).pipe(tap((res: UserDto) => {
            user.colidEntrySubscriptions = res.colidEntrySubscriptions;
            patchState({
                user: user
            });
            this.store.dispatch(new FetchColidEntrySubscriptionNumbers(colidEntrySubscriptionDto.colidPidUri))
        }));
    }
}
