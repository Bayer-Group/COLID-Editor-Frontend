import { ConsumerGroupResultDTO } from '../shared/models/consumerGroups/consumer-group-result-dto';
import { Selector, State, StateContext, Action, Store } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { ConsumerGroupApiService } from '../core/http/consumer-group.api.service';
import { UserDto } from '../shared/models/user/user-dto';
import { UserInfoApiService } from '../core/http/user-info.api.service';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Constants } from '../shared/constants';

export class FetchUser {
  static readonly type = '[User] Fetch User';
  constructor(
    public id: string,
    public emailAddress: string
  ) {}
}

export class ReloadUser {
  static readonly type = '[User] Reload User';
  constructor() {}
}

export class SetLastLoginEditor {
  static readonly type = '[User] Select Last Login Editor';
  constructor() {}
}

export class FetchConsumerGroupsByUser {
  static readonly type = '[User] Fetch consumerGroups by user';
  constructor() {}
}

export class SelectConsumerGroup {
  static readonly type = '[User] Select consumerGroup';
  constructor(
    public consumerGroupId: string,
    public consumerGroupDefaulReviewCyclePolicy?: string
  ) {}
}

export class SetDefaultConsumerGroupForUser {
  static readonly type = '[UserI] Set default ConsumerGroup';
  constructor(public selectedConsumerGroupId: string) {}
}

export class UserInfoStateModel {
  user: UserDto;
  consumerGroups: ConsumerGroupResultDTO[];
  selectedConsumerGroupId: string;
  selectedConsumerGroupDefaultReviewCyclePolicy: string;
  selectedConsumerGroupResourceTemplates: string[];
  fetched: boolean;
}

@State<UserInfoStateModel>({
  name: 'UserInfo',
  defaults: {
    user: null,
    consumerGroups: null,
    selectedConsumerGroupId: null,
    selectedConsumerGroupDefaultReviewCyclePolicy: null,
    selectedConsumerGroupResourceTemplates: null,
    fetched: false
  }
})
@Injectable()
export class UserInfoState {
  constructor(
    private store: Store,
    private userInfoApiService: UserInfoApiService,
    private consumerGroupService: ConsumerGroupApiService
  ) {}

  @Selector()
  public static getUser(state: UserInfoStateModel) {
    return state.user;
  }

  @Selector()
  public static getConsumerGroups(state: UserInfoStateModel) {
    return state.consumerGroups;
  }

  @Selector()
  public static getSelectedConsumerGroupId(state: UserInfoStateModel) {
    return state.selectedConsumerGroupId;
  }

  @Selector()
  public static getSelectedConsumerGroupDefaultReviewCyclePolicy(
    state: UserInfoStateModel
  ) {
    return state.selectedConsumerGroupDefaultReviewCyclePolicy;
  }

  @Selector()
  public static getSelectedConsumerGroupTemplateIds(state: UserInfoStateModel) {
    return state.selectedConsumerGroupResourceTemplates;
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
  public static getColidEntrySubscriptions(state: UserInfoStateModel) {
    return state.user.colidEntrySubscriptions;
  }

  @Selector()
  public static getIsFetched(state: UserInfoStateModel) {
    return state.fetched;
  }

  @Selector()
  public static getUserDepartment(state: UserInfoStateModel) {
    return state.user.department;
  }

  @Action(FetchUser)
  fetchUser(
    { patchState }: StateContext<UserInfoStateModel>,
    { id, emailAddress }: FetchUser
  ) {
    return this.userInfoApiService.getUser(id).pipe(
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
          if (
            res.searchFilterEditor.filterJson.searchText != null ||
            res.searchFilterEditor.filterJson.consumerGroup != null ||
            res.searchFilterEditor.filterJson.lastChangeUser != null ||
            res.searchFilterEditor.filterJson.published ||
            res.searchFilterEditor.filterJson.draft
          ) {
            // dispatch([new SetSidebarSearch(res.searchFilterEditor.filterJson)]).subscribe();
          }
        }
      }),
      catchError((err) => {
        if (err.status === 404) {
          return this.userInfoApiService.createUser(id, emailAddress).pipe(
            tap((res: UserDto) => {
              patchState({
                user: res
              });
            })
          );
        }
        return of(null);
      })
    );
  }

  @Action(ReloadUser)
  reloadUser(ctx: StateContext<UserInfoStateModel>) {
    const user = ctx.getState().user;
    ctx.dispatch(new FetchUser(user.id, user.emailAddress)).subscribe();
  }

  @Action(SetLastLoginEditor)
  setLastLoginEditor(
    { getState, patchState }: StateContext<UserInfoStateModel>,
    {}: SetLastLoginEditor
  ) {
    const user = getState().user;
    const loginDate = new Date();
    if (user != null) {
      return this.userInfoApiService
        .setLastLoginEditor(user.id, loginDate)
        .pipe(
          tap((_) => {
            user.lastLoginEditor = loginDate;
            patchState({
              user: user
            });
          })
        );
    }
  }

  @Action(FetchConsumerGroupsByUser)
  fetchConsumerGroupsByUser(
    { patchState, getState }: StateContext<UserInfoStateModel>,
    {}: FetchConsumerGroupsByUser
  ) {
    return this.consumerGroupService.getActiveEntities().pipe(
      tap((activeConsumerGroups: ConsumerGroupResultDTO[]) => {
        let selectedConsumerGroupId = getState().selectedConsumerGroupId;
        let selectedConsumerGroupDefaultReviewCyclePolicy =
          getState().selectedConsumerGroupDefaultReviewCyclePolicy;
        let resourceTemplateMappingsOfActiveConsumerGroup: string[] = [];

        if (activeConsumerGroups.length > 0) {
          // Use the first consumer group as the selected one, if it has not been set yet (e.g. through from the default consumer group)
          // If it has been set before, then the selected consumer group is available in the list of active consumer groups.
          // The consumer group could be inactive or have been deleted, whiel the user had it selected as the default consumer group
          if (selectedConsumerGroupId == null) {
            selectedConsumerGroupId = activeConsumerGroups[0].id;
            selectedConsumerGroupDefaultReviewCyclePolicy =
              activeConsumerGroups[0].properties[
                Constants.ConsumerGroup.HasDefaultReviewCyclePolicy
              ]
                ? activeConsumerGroups[0].properties[
                    Constants.ConsumerGroup.HasDefaultReviewCyclePolicy
                  ][0]
                : null;
          } else {
            const activeSelectedCG = activeConsumerGroups.find(
              (acg) => acg.id === selectedConsumerGroupId
            );

            if (activeSelectedCG == null) {
              selectedConsumerGroupId = activeConsumerGroups[0].id;
              selectedConsumerGroupDefaultReviewCyclePolicy =
                activeConsumerGroups[0].properties[
                  Constants.ConsumerGroup.HasDefaultReviewCyclePolicy
                ]
                  ? activeConsumerGroups[0].properties[
                      Constants.ConsumerGroup.HasDefaultReviewCyclePolicy
                    ][0]
                  : null;
            } else {
              selectedConsumerGroupDefaultReviewCyclePolicy = activeSelectedCG
                .properties[Constants.ConsumerGroup.HasDefaultReviewCyclePolicy]
                ? activeSelectedCG.properties[
                    Constants.ConsumerGroup.HasDefaultReviewCyclePolicy
                  ][0]
                : null;
            }
          }

          // set the available resource templates to the selected consumer group
          resourceTemplateMappingsOfActiveConsumerGroup =
            activeConsumerGroups.find((cg) => cg.id === selectedConsumerGroupId)
              .properties[Constants.ResourceTemplates.HasResourceTemplates];

          // for testing purposes filter out Open For Everyone
          // activeConsumerGroups = activeConsumerGroups.filter(
          //   (x) =>
          //     x.properties["https://pid.bayer.com/kos/19050#hasAdRole"][0] !=
          //     "PID.Group10Data.ReadWrite"
          // );
        }

        patchState({
          fetched: true,
          consumerGroups: activeConsumerGroups,
          selectedConsumerGroupId: selectedConsumerGroupId,
          selectedConsumerGroupDefaultReviewCyclePolicy:
            selectedConsumerGroupDefaultReviewCyclePolicy,
          selectedConsumerGroupResourceTemplates:
            resourceTemplateMappingsOfActiveConsumerGroup
        });
      })
    );
  }

  @Action(SelectConsumerGroup)
  SelectConsumerGroup(
    { patchState, getState }: StateContext<UserInfoStateModel>,
    {
      consumerGroupId,
      consumerGroupDefaulReviewCyclePolicy
    }: SelectConsumerGroup
  ) {
    const resourceTemplateMappingsOfActiveConsumerGroup =
      getState().consumerGroups.find((cg) => cg.id === consumerGroupId)
        .properties[Constants.ResourceTemplates.HasResourceTemplates];

    patchState({
      selectedConsumerGroupId: consumerGroupId,
      selectedConsumerGroupDefaultReviewCyclePolicy:
        consumerGroupDefaulReviewCyclePolicy,
      selectedConsumerGroupResourceTemplates:
        resourceTemplateMappingsOfActiveConsumerGroup
    });
  }

  @Action(SetDefaultConsumerGroupForUser)
  SetDefaultConsumerGroupForUser(
    { patchState, getState }: StateContext<UserInfoStateModel>,
    { selectedConsumerGroupId }: SetDefaultConsumerGroupForUser
  ) {
    const user = getState().user;
    return this.userInfoApiService
      .setDefaultConsumerGroup(user.id, selectedConsumerGroupId)
      .pipe(
        tap((res: UserDto) => {
          user.defaultConsumerGroup = res.defaultConsumerGroup;
          patchState({
            user: user
          });
        })
      );
  }
}
