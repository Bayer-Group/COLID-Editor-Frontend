import { Selector, State, StateContext, Action } from '@ngxs/store';

// Actions
export class SetResourceFormTouched {
    static readonly type = '[ResourceForm] Set resource form touched';

    constructor(public payload: boolean) {}
}


export class ResourceFormStateModel {
    touched: boolean;
}

@State<ResourceFormStateModel>({
    name: 'ResourceForm',
    defaults: {
        touched: false
    }
})

export class ResourceFormState {
    constructor() { }

    @Selector()
    public static getResourceFormTouched(state: ResourceFormStateModel) {
        return state.touched;
    }

    @Action(SetResourceFormTouched)
    setResourceFormTouched({ patchState }: StateContext<ResourceFormStateModel>, { payload }: SetResourceFormTouched) {
        patchState({
            touched: payload,
        });
    }
}
