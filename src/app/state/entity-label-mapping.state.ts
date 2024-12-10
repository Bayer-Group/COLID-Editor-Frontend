import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { EntityApiService } from '../core/http/entity.api.service';
import { tap } from 'rxjs/operators';

export class FetchEntityLabelMapping {
  static readonly type =
    '[EntityLabelMapping] Fetch label mapping for entities';
  constructor() {}
}

export class EntityLabelStateModel {
  labels: Map<string, string>;
}

@State<EntityLabelStateModel>({
  name: 'EntityLabelMapping',
  defaults: {
    labels: new Map()
  }
})
@Injectable()
export class EntityLabelMappingState {
  constructor(private entityApiService: EntityApiService) {}
  @Selector()
  public static getConsumerGroups(state: EntityLabelStateModel) {
    return state.labels;
  }

  @Action(FetchEntityLabelMapping)
  fetchEntityLabelMapping({ patchState }: StateContext<EntityLabelStateModel>) {
    return this.entityApiService.getEntityLabelsMapping().pipe(
      tap((res) => {
        patchState({
          labels: new Map(res.map((entity) => [entity.id, entity.labelName]))
        });
      })
    );
  }
}
