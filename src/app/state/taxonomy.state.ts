import { Selector, State, StateContext, Action } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { TaxonomyService } from '../core/http/taxonomy.api.service';
import { TaxonomyResultDTO } from '../shared/models/taxonomy/taxonomy-result-dto';
import { Injectable } from '@angular/core';

export class TaxonomyStateModel {
  taxonomyResults: Map<string, TaxonomyResultDTO[]>;
}

export class FetchTaxonomyList {
  static readonly type = '[Taxonomy] Fetch taxonomy list';
  constructor(
    public type: string,
    public refresh: boolean = false
  ) {}
}

@State<TaxonomyStateModel>({
  name: 'Taxonomy',
  defaults: {
    taxonomyResults: new Map<string, TaxonomyResultDTO[]>()
  }
})
@Injectable()
export class TaxonomyState {
  constructor(private taxonomyApiService: TaxonomyService) {}

  @Selector()
  public static getTaxonomyList(state: TaxonomyStateModel) {
    return state.taxonomyResults;
  }

  @Action(FetchTaxonomyList)
  fetchTaxonomyList(
    state: StateContext<TaxonomyStateModel>,
    action: FetchTaxonomyList
  ) {
    if (!state.getState().taxonomyResults.has(action.type) || action.refresh) {
      return this.taxonomyApiService.getTaxonomyList(action.type).pipe(
        tap((res: TaxonomyResultDTO[]) => {
          var taxonomy: Map<string, TaxonomyResultDTO[]> =
            state.getState().taxonomyResults;

          taxonomy.set(action.type, res);
          state.patchState({
            taxonomyResults: new Map<string, TaxonomyResultDTO[]>(taxonomy)
          });
        })
      );
    }
  }
}
