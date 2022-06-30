import { Selector, State, StateContext, Action, Store, Select } from '@ngxs/store';
import { ColidEntrySubscriptionDto } from '../shared/models/user/colid-entry-subscription-dto';
import { LogService } from '../core/logging/log.service';
import { ColidEntryApiService } from '../core/http/colid-entries.api.service';
import { Router } from '@angular/router';
  
export class FetchColidEntrySubscriptionNumbers {
    static readonly type = '[ColidEntrySubscriptionNumbers] Fetch FetchColidEntrySubscriptionNumbers';
    constructor(public pidUri: string) { }

 }

export class ColidEntrySubscriberCountStateModel {
    loading:boolean;
    colidEntrySubscriptions: ColidEntrySubscriptionDto;
}

@State<ColidEntrySubscriberCountStateModel>({
    name: 'ColidEntrySubscriptionNumbers',
    defaults: {
        loading:false,
        colidEntrySubscriptions: null
    }
})

export class ColidEntrySubscriberCountState {
    constructor(private logger: LogService, private colidEntrieService: ColidEntryApiService, private store: Store, private router: Router) {
    
    }
  
    @Selector()
    public static getSubscriptionNumbers(state: ColidEntrySubscriberCountStateModel) {
      return state.colidEntrySubscriptions;
    }

    @Action(FetchColidEntrySubscriptionNumbers)
    FetchColidEntrySubscriptionNumbers({ patchState}: StateContext<ColidEntrySubscriberCountStateModel>, {pidUri}: FetchColidEntrySubscriptionNumbers) {
        this.colidEntrieService.getColidEntrySubscriptionCount(pidUri).subscribe(
            cs => {
                patchState({
                     colidEntrySubscriptions:cs.pop()
                });
            });
    }
}