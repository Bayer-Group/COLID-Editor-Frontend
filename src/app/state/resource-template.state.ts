import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ResourceTemplateResultDTO } from '../shared/models/resource-templates/resource-template-result-dto';
import { ResourceTemplateApiService } from '../core/http/resource-template.api.service';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { MetaDataProperty } from '../shared/models/metadata/meta-data-property';

export class FetchResourceTemplates {
  static readonly type = '[ResourceTemplate] Fetch ResourceTemplates';
  constructor() {}
}

export class ResourceTemplateStateModel {
  resourceTemplates: ResourceTemplateResultDTO[];
  resourceTemplate: ResourceTemplateResultDTO;
  metadata: MetaDataProperty[];
}

@State<ResourceTemplateStateModel>({
  name: 'resourceTemplates',
  defaults: {
    resourceTemplates: null,
    resourceTemplate: null,
    metadata: null
  }
})
@Injectable()
export class ResourceTemplateState {
  constructor(private resourceTemplateApiService: ResourceTemplateApiService) {}

  @Selector()
  public static getResourceTemplates(state: ResourceTemplateStateModel) {
    return state.resourceTemplates;
  }

  @Selector()
  public static getResourceTemplate(state: ResourceTemplateStateModel) {
    return state.resourceTemplate;
  }

  @Selector()
  public static getResourceTemplatesMetadata(
    state: ResourceTemplateStateModel
  ) {
    return state.metadata;
  }

  @Action(FetchResourceTemplates)
  fetchResourceTemplates({
    patchState
  }: StateContext<ResourceTemplateStateModel>) {
    patchState({
      resourceTemplates: null
    });
    return this.resourceTemplateApiService.getAllEntities().pipe(
      tap((res) => {
        patchState({
          resourceTemplates: res
        });
      })
    );
  }
}
