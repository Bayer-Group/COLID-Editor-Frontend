import { Selector, State, StateContext, Action } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { ColidEntrySubscriptionDto } from '../shared/models/user/colid-entry-subscription-dto';
import { ResourceApiService } from '../core/http/resource.api.service';
import { ResourceSearchDTO } from '../shared/models/search/resource-search-dto';
import { ResourceOverviewCTO } from '../shared/models/resources/resource-overview-cto';
import { Injectable } from '@angular/core';

export class FetchColidEntrySubscriptions {
  static readonly type =
    '[ColidEntrySubscription] Fetch ColidEntrySubscriptions';
  constructor(public colidEntrySubscriptions: ColidEntrySubscriptionDto[]) {}
}

export class ColidEntrySubscriptionsStateModel {
  loading: boolean;
  colidEntrySubscriptions: ResourceOverviewCTO;
}

@State<ColidEntrySubscriptionsStateModel>({
  name: 'ColidEntrySubscription',
  defaults: {
    loading: false,
    colidEntrySubscriptions: null
  }
})
@Injectable()
export class ColidEntrySubscriptionsState {
  constructor(private resourceApiService: ResourceApiService) {}

  @Selector()
  public static getColidEntrySubscriptions(
    state: ColidEntrySubscriptionsStateModel
  ) {
    return state.colidEntrySubscriptions;
  }

  @Selector()
  public static loading(state: ColidEntrySubscriptionsStateModel) {
    return state.loading;
  }

  @Action(FetchColidEntrySubscriptions)
  fetchColidEntrySubscriptions(
    ctx: StateContext<ColidEntrySubscriptionsStateModel>,
    action: FetchColidEntrySubscriptions
  ) {
    ctx.patchState({
      loading: true
    });

    const colidEntrySubscriptions = action.colidEntrySubscriptions;

    if (
      colidEntrySubscriptions == null ||
      colidEntrySubscriptions.length === 0
    ) {
      ctx.patchState({
        loading: false
      });
      return;
    }

    let resourceSearch = new ResourceSearchDTO();
    resourceSearch.limit = action.colidEntrySubscriptions.length;
    resourceSearch.pidUris = action.colidEntrySubscriptions.map(
      (ces) => ces.colidPidUri
    );

    return this.resourceApiService.getFilteredResources(resourceSearch).pipe(
      tap(
        (resourceOverviewCto) => {
          if (resourceOverviewCto != null) {
            ctx.patchState({
              loading: false,
              colidEntrySubscriptions: resourceOverviewCto
            });
          }
        },
        (_) => {
          ctx.patchState({
            loading: false
          });
        }
      )
    );
  }
}
