import { Selector, State, StateContext, Action } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { WelcomeMessageApiService } from '../core/http/welcome.message.api.service';
import { WelcomeMessage } from '../shared/models/welcome-message/welcome-message';

export class FetchWelcomeMessage {
    static readonly type = '[WelcomeMessage] Fetch welcome message';
    constructor() { }
}

export class UpdateWelcomeMessage {
    static readonly type = '[WelcomeMessage] Update welcome message';
    constructor(public str: string) { }
}

export class WelcomeMessageStateModel {
    welcomeMessage: WelcomeMessage;
}

@State<WelcomeMessageStateModel>({
    name: 'WelcomeMessage',
    defaults: {
        welcomeMessage: null
    }
})

export class WelcomeMessageState {

    constructor(private welcomeMessageApiService: WelcomeMessageApiService) { }

    @Selector()
    public static getWelcomeMessage(state: WelcomeMessageStateModel) {
        return state.welcomeMessage;
    }

    @Action(UpdateWelcomeMessage) 
    UpdateWelcomeMessage(ctx: StateContext<WelcomeMessageStateModel>, action: UpdateWelcomeMessage) {
        return this.welcomeMessageApiService.updateWelcomeMessageEditor(action.str).pipe(tap((res: WelcomeMessage) => {
            ctx.patchState({
                welcomeMessage: res
            });
        }));
    }

    @Action(FetchWelcomeMessage) 
    FetchWelcomeMessage({ patchState }: StateContext<WelcomeMessageStateModel>, { }: FetchWelcomeMessage) {
        return this.welcomeMessageApiService.getWelcomeMessageEditor().pipe(tap((res: WelcomeMessage) => {
            patchState({
                welcomeMessage: res
            });
        }));
    }
}