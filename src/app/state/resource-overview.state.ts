import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { ResourceApiService } from '../core/http/resource.api.service';
import { ResourceSearchDTO } from '../shared/models/search/resource-search-dto';
import { ResourceOverviewCTO } from '../shared/models/resources/resource-overview-cto';

export class FetchSidebarResourceOverview {
  static readonly type = '[ResourcesOverview] Fetch';
}

export class SetSidebarSearch {
  static readonly type = '[ResourcesOverview] SetSidebarSearch';

  constructor(public payload: ResourceSearchDTO) { }
}

export class FetchNextResourceBatch {
  static readonly type = '[ResourcesOverview] Fetch Next Resource Batch';

  constructor(public payload: number) { }
}

export class ResourceOverviewStateModel {
  loading: boolean;
  resourceOverviewSearch: ResourceSearchDTO;
  resourceSidebarOverview: ResourceOverviewCTO;
}

@State<ResourceOverviewStateModel>({
  name: 'resourceOverview',
  defaults: {
    loading: true,
    resourceOverviewSearch: null,
    resourceSidebarOverview: new ResourceOverviewCTO(),
  }
})

export class ResourceOverviewState {

  constructor(private resourceService: ResourceApiService, private store: Store) { }

  @Selector()
  public static resourceSidebarOverview(state: ResourceOverviewStateModel) {
    return state.resourceSidebarOverview;
  }

  @Selector()
  public static loading(state: ResourceOverviewStateModel) {
    return state.loading;
  }

  @Selector()
  public static resourceOverviewSearch(state: ResourceOverviewStateModel) {
    return state.resourceOverviewSearch;
  }

  @Action(FetchSidebarResourceOverview)
  fetchSidebarResourcesOverview({ getState, patchState }: StateContext<ResourceOverviewStateModel>, { }: FetchSidebarResourceOverview) {
    const state = getState();
    patchState({
      loading: true
    });

    if (state.resourceOverviewSearch !== null) {
      const newResourceOverviewSearch = state.resourceOverviewSearch;
      newResourceOverviewSearch.limit = state.resourceOverviewSearch.limit + state.resourceOverviewSearch.offset;
      newResourceOverviewSearch.offset = 0;
      this.resourceService.getFilteredResources(newResourceOverviewSearch).subscribe(res => {
        patchState({
          resourceSidebarOverview: res,
          loading: false
        });
      });
    }
  }

  @Action(FetchNextResourceBatch)
  fetchNextResourceBatch({ getState, patchState }: StateContext<ResourceOverviewStateModel>,
    { payload }: FetchNextResourceBatch) {
    const state = getState();
    const searchFilters = state.resourceOverviewSearch;
    // offset mean already loaded records plus limit.
    // If already loaded records is more than the payload (rendered rows), no need to load further.
    if (searchFilters.offset > payload) {
      return;
    }

    searchFilters.offset = searchFilters.offset + searchFilters.limit;

    patchState({
      loading: true
    });

    this.resourceService.getFilteredResources(state.resourceOverviewSearch).subscribe(res => {
      if (state.resourceOverviewSearch.offset >= state.resourceSidebarOverview.items.length) {

        const mergedState = state.resourceSidebarOverview;
        mergedState.items = [...state.resourceSidebarOverview.items, ...res.items];

        patchState({
          loading: false,
          resourceOverviewSearch: searchFilters,
          resourceSidebarOverview: { ...mergedState }
        });
      }
    });
  }


  @Action(SetSidebarSearch)
  setSidebarSearch({ patchState }: StateContext<ResourceOverviewStateModel>, { payload }: SetSidebarSearch) {
    patchState({
      resourceOverviewSearch: payload
    });

    this.store.dispatch(new FetchSidebarResourceOverview()).subscribe();
  }
}
