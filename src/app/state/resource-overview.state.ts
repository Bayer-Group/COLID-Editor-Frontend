import {
  State,
  Action,
  StateContext,
  Selector,
  Store,
  Actions
} from '@ngxs/store';
import { ResourceSearchDTO } from '../shared/models/search/resource-search-dto';
import { SearchService } from '../core/http/search.service';
import { SearchResult } from '../shared/models/search/search-result';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export class FetchSidebarResourceOverview {
  static readonly type = '[ResourcesOverview] Fetch';
  constructor(public payload: boolean = false) {}
}

export class SetSidebarSearch {
  static readonly type = '[ResourcesOverview] SetSidebarSearch';

  constructor(public payload: ResourceSearchDTO) {}
}

export class FetchNextResourceBatch {
  static readonly type = '[ResourcesOverview] Fetch Next Resource Batch';

  constructor(public payload: number) {}
}

export class ResourceOverviewStateModel {
  loading: boolean;
  resourceOverviewSearch: ResourceSearchDTO;
  searchResult: SearchResult;
  initialLoad: boolean;
}

@State<ResourceOverviewStateModel>({
  name: 'resourceOverview',
  defaults: {
    loading: true,
    resourceOverviewSearch: null,
    searchResult: new SearchResult(),
    initialLoad: false
  }
})
@Injectable()
export class ResourceOverviewState {
  constructor(
    private actions$: Actions,
    private store: Store,
    private searchService: SearchService
  ) {}

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

  @Selector()
  public static initialLoad(state: ResourceOverviewStateModel) {
    return state.initialLoad;
  }

  @Action(FetchSidebarResourceOverview, { cancelUncompleted: true })
  fetchSidebarResourcesOverview(
    { getState, patchState }: StateContext<ResourceOverviewStateModel>,
    { payload }: FetchSidebarResourceOverview
  ) {
    const state = getState();
    patchState({
      loading: true,
      resourceOverviewSearch: {
        ...state.resourceOverviewSearch,
        offset: 0
      },
      initialLoad: true
    });
    if (state.resourceOverviewSearch !== null) {
      return this.searchService
        .search(state.resourceOverviewSearch, payload, false)
        .pipe(
          tap((res) => {
            patchState({
              searchResult: res,
              loading: false
            });
          })
        );
    }
  }

  @Action(FetchNextResourceBatch)
  fetchNextResourceBatch(
    { getState, patchState }: StateContext<ResourceOverviewStateModel>,
    { payload }: FetchNextResourceBatch
  ) {
    const state = getState();
    const searchFilters = state.resourceOverviewSearch;
    // offset mean already loaded records plus limit.
    // If already loaded records is more than the payload (rendered rows), no need to load further.
    if (searchFilters.offset > payload) {
      return;
    }

    searchFilters.offset = searchFilters.offset + searchFilters.limit;

    patchState({
      loading: true,
      initialLoad: false
    });

    this.searchService
      .search(state.resourceOverviewSearch)
      .subscribe((searchResult) => {
        if (
          state.resourceOverviewSearch.offset >=
          state.searchResult.hits.hits.length
        ) {
          searchResult.hits.hits = [
            ...state.searchResult.hits.hits,
            ...searchResult.hits.hits
          ];

          patchState({
            loading: false,
            resourceOverviewSearch: searchFilters,
            searchResult: searchResult
          });
        }
      });
  }

  @Action(SetSidebarSearch)
  setSidebarSearch(
    { patchState }: StateContext<ResourceOverviewStateModel>,
    { payload }: SetSidebarSearch
  ) {
    patchState({
      resourceOverviewSearch: payload
    });
    this.store.dispatch(new FetchSidebarResourceOverview());
  }
}
