import { StateContext, Action, Selector, State } from '@ngxs/store';
import { mergeMap, tap } from 'rxjs/operators';
import { MetaDataProperty } from '../shared/models/metadata/meta-data-property';
import { PidUriTemplateResultDTO } from '../shared/models/pidUriTemplates/pid-uri-template-result-dto';
import { PidUriTemplateApiService } from '../core/http/pid-uri-template.api.service';
import { MetaDataApiService } from '../core/http/meta-data.api.service';
import { Constants } from '../shared/constants';
import { PidUriTemplateRequestDTO } from '../shared/models/pidUriTemplates/pid-uri-template-request-dto';
import { Injectable } from '@angular/core';
import { FetchTaxonomyList } from './taxonomy.state';

export class FetchPidUriTemplates {
  static readonly type = '[PidUriTemplate] Fetch PidUriTemplates';
  constructor() {}
}

export class FetchPidUriTemplateDetails {
  static readonly type = '[PidUriTemplate] Fetch PidUriTemplateDetails';
  constructor(public payload: string) {}
}

export class FetchPidUriTemplateMetadata {
  static readonly type = '[PidUriTemplate] Fetch PidUriTemplateMetadata';
  constructor() {}
}

export class CreatePidUriTemplate {
  static readonly type = '[PidUriTemplate] Create PidUriTemplate';
  constructor(public payload: PidUriTemplateRequestDTO) {}
}

export class EditPidUriTemplate {
  static readonly type = '[PidUriTemplate] Edit PidUriTemplate';
  constructor(
    public id: string,
    public payload: PidUriTemplateRequestDTO
  ) {}
}

export class DeletePidUriTemplate {
  static readonly type = '[PidUriTemplate] Delete PidUriTemplate';
  constructor(public payload: string) {}
}

export class ReactivatePidUriTemplate {
  static readonly type = '[PidUriTemplate] Reactivate PidUriTemplate';
  constructor(public payload: string) {}
}

export class ClearPidUriTemplate {
  static readonly type = '[PidUriTemplate] Clear PidUriTemplate';
}

export class PidUriTemplateStateModel {
  pidUriTemplatesFetched: boolean;
  pidUriTemplates: PidUriTemplateResultDTO[];
  pidUriTemplate: PidUriTemplateResultDTO;
  metadata: MetaDataProperty[];
}

@State<PidUriTemplateStateModel>({
  name: 'pidUriTemplates',
  defaults: {
    pidUriTemplatesFetched: false,
    pidUriTemplates: null,
    pidUriTemplate: null,
    metadata: null
  }
})
@Injectable()
export class PidUriTemplateState {
  constructor(
    private pidUriTemplateApiService: PidUriTemplateApiService,
    private metadataService: MetaDataApiService
  ) {}

  @Selector()
  public static getPidUriTemplates(state: PidUriTemplateStateModel) {
    return state.pidUriTemplates;
  }

  @Selector()
  public static getPidUriTemplate(state: PidUriTemplateStateModel) {
    return state.pidUriTemplate;
  }

  @Selector()
  public static getPidUriTemplateMetadata(state: PidUriTemplateStateModel) {
    return state.metadata;
  }

  @Selector()
  public static getPidUriTemplatesFetched(state: PidUriTemplateStateModel) {
    return state.pidUriTemplatesFetched;
  }

  @Action(FetchPidUriTemplates)
  fetchPidUriTemplates(
    { patchState }: StateContext<PidUriTemplateStateModel>,
    {}: FetchPidUriTemplates
  ) {
    patchState({
      pidUriTemplates: null,
      pidUriTemplatesFetched: false
    });
    return this.pidUriTemplateApiService.getAllEntities().pipe(
      tap((res) => {
        patchState({
          pidUriTemplates: res,
          pidUriTemplatesFetched: true
        });
      })
    );
  }

  @Action(FetchPidUriTemplateMetadata)
  fetchPidUriTemplateMetadata(
    { getState, patchState, dispatch }: StateContext<PidUriTemplateStateModel>,
    {}: FetchPidUriTemplateMetadata
  ) {
    if (getState().metadata != null) {
      return;
    }

    return dispatch([
      new FetchTaxonomyList(Constants.Metadata.PidUriTemplateIdType),
      new FetchTaxonomyList(Constants.Metadata.PidUriTemplateSuffix)
    ]).pipe(
      mergeMap((_) => {
        return this.metadataService
          .getMetaData(Constants.ResourceTypes.PidUriTemplate)
          .pipe(
            tap((res) => {
              patchState({
                metadata: res
              });
            })
          );
      })
    );
  }

  @Action(CreatePidUriTemplate)
  createPidUriTemplate(
    { dispatch }: StateContext<PidUriTemplateStateModel>,
    { payload }: CreatePidUriTemplate
  ) {
    return this.pidUriTemplateApiService
      .createEntity(payload)
      .pipe(mergeMap(() => dispatch(new FetchPidUriTemplates())));
  }

  @Action(DeletePidUriTemplate)
  deletePidUriTemplate(
    { dispatch }: StateContext<PidUriTemplateStateModel>,
    { payload }: DeletePidUriTemplate
  ) {
    return this.pidUriTemplateApiService
      .deleteEntity(payload)
      .pipe(mergeMap(() => dispatch(new FetchPidUriTemplates())));
  }

  @Action(ReactivatePidUriTemplate)
  reactivatePidUriTemplate(
    { dispatch }: StateContext<PidUriTemplateStateModel>,
    { payload }: ReactivatePidUriTemplate
  ) {
    return this.pidUriTemplateApiService
      .reactivatePidUriTemplate(payload)
      .pipe(mergeMap(() => dispatch(new FetchPidUriTemplates())));
  }

  @Action(EditPidUriTemplate)
  editPidUriTemplate(
    { dispatch }: StateContext<PidUriTemplateStateModel>,
    { id, payload }: EditPidUriTemplate
  ) {
    return this.pidUriTemplateApiService
      .editEntity(id, payload)
      .pipe(mergeMap(() => dispatch(new FetchPidUriTemplates())));
  }

  @Action(FetchPidUriTemplateDetails)
  fetchPidUriTemplateDetails(
    { patchState }: StateContext<PidUriTemplateStateModel>,
    { payload }: FetchPidUriTemplateDetails
  ) {
    return this.pidUriTemplateApiService.getEntityById(payload).pipe(
      tap((res) => {
        patchState({
          pidUriTemplate: res
        });
      })
    );
  }

  @Action(ClearPidUriTemplate)
  clearPidUriTemplate(
    { patchState }: StateContext<PidUriTemplateStateModel>,
    {}: ClearPidUriTemplate
  ) {
    patchState({
      pidUriTemplate: null
    });
  }
}
