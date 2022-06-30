import { State, Action, StateContext, Selector, Store, Actions, ofAction, ofActionDispatched } from '@ngxs/store';
import { ResourceSearchDTO } from '../shared/models/search/resource-search-dto';
import { SearchService } from '../core/http/search.service';
import { SearchResult } from '../shared/models/search/search-result';
import { takeUntil } from 'rxjs/operators';

export class FetchSidebarResourceOverview {
  static readonly type = '[ResourcesOverview] Fetch';

  constructor(public payload : boolean = false ) { }

}

export class SetSidebarSearch {
  static readonly type = '[ResourcesOverview] SetSidebarSearch';

  constructor(public payload: ResourceSearchDTO) { }
}

export class SetInitialSidebarSearch {
  static readonly type = '[ResourcesOverview] SetInitialSidebarSearch';

  constructor(public payload: ResourceSearchDTO) { }
}

export class FetchNextResourceBatch {
  static readonly type = '[ResourcesOverview] Fetch Next Resource Batch';

  constructor(public payload: number) { }
}

export class ResourceOverviewStateModel {
  loading: boolean;
  resourceOverviewSearch: ResourceSearchDTO;
  searchResult: SearchResult;
}

@State<ResourceOverviewStateModel>({
  name: 'resourceOverview',
  defaults: {
    loading: true,
    resourceOverviewSearch: null,
    searchResult: new SearchResult(),
  }
})

export class ResourceOverviewState {

  constructor(private actions$: Actions, private store: Store, private searchService: SearchService) { }

  @Selector()
  public static searchResult(state: ResourceOverviewStateModel): SearchResult {
    return state.searchResult;
  }

  @Selector()
  public static loading(state: ResourceOverviewStateModel) {
    return state.loading;
  }

  @Selector()
  public static resourceOverviewSearch(state: ResourceOverviewStateModel) {
    return state.resourceOverviewSearch;
  }

  @Action(FetchSidebarResourceOverview, { cancelUncompleted: true })
  fetchSidebarResourcesOverview({ getState, patchState }: StateContext<ResourceOverviewStateModel>, {payload}: FetchSidebarResourceOverview) {
    const state = getState();
    patchState({
      loading: true
    });
    if (state.resourceOverviewSearch !== null) {
      const newResourceOverviewSearch = state.resourceOverviewSearch;
      newResourceOverviewSearch.limit = state.resourceOverviewSearch.limit + state.resourceOverviewSearch.offset;
      newResourceOverviewSearch.offset = 0;

      return this.searchService.search(newResourceOverviewSearch,payload,false ).pipe(
        takeUntil(this.actions$.pipe(ofActionDispatched(FetchSidebarResourceOverview)))
      ).subscribe(res => {
        patchState({
          searchResult: res,
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

    this.searchService.search(state.resourceOverviewSearch).subscribe(searchResult => {
      if (state.resourceOverviewSearch.offset >= state.searchResult.hits.hits.length) {

        searchResult.hits.hits = [...state.searchResult.hits.hits, ...searchResult.hits.hits]

        patchState({
          loading: false,
          resourceOverviewSearch: searchFilters,
          searchResult: searchResult
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
  
  @Action(SetInitialSidebarSearch)
  setInitialSidebarSearch({ patchState }: StateContext<ResourceOverviewStateModel>, { payload }: SetSidebarSearch) {
  patchState({
    resourceOverviewSearch: payload, //null
    loading: false, //first time false
    searchResult: new SearchResult(), //first time empty
  });
  //this.store.dispatch(new FetchSidebarResourceOverview()).subscribe();
}
}

