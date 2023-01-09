import { State, Action, StateContext, Selector } from '@ngxs/store';
import { MetaDataProperty } from '../shared/models/metadata/meta-data-property';
import { MetaDataApiService } from '../core/http/meta-data.api.service';
import { Constants } from '../shared/constants';
import { EntityTypeDto } from '../shared/models/Entities/entity-type-dto';
import { ResourceApiService } from '../core/http/resource.api.service';
import { Injectable } from '@angular/core';

export class ClearMetaData {
  static readonly type = '[MetaData] Clear';
}

export class ClearActiveSecondMetaData {
  static readonly type = '[MetaData] ClearActiveSecond';
}

export class FetchMetadata {
  static readonly type = '[MetaData] FetchMetadata';

  constructor(public entityType: string) { }
}

export class FetchSecondMetadata {
  static readonly type = '[MetaData] FetchSecondMetadata';

  constructor(public entityType: string) { }
}

export class FetchMetadataRelease {
  static readonly type = '[MetaData] FetchHistoricMetadata';

  constructor(public entityType: string, public metadataRelease: string) { }
}

export class FetchHierarchy {
  static readonly type = '[Hierarchy] Fetch';
}

export class FetchLinkResourcesTypesMetadata {
  static readonly type = '[FetchLinkResourcesTypesMetadata] Fetch';
  constructor(public resourceType: string[] ) { }
}

export class MetaDataStateModel {
  loading: boolean;
  metadataType: string;
  metadata: Map<string, Array<MetaDataProperty>>;
  hierarchy: EntityTypeDto;
  linkResourceTypes : Map<string,string[]>;
  secondMetadataType: string;
  secondMetadata: Map<string, Array<MetaDataProperty>>;
}

@State<MetaDataStateModel>({
  name: 'metaData',
  defaults: {
    hierarchy: null,
    loading: true,
    metadata: new Map<string, Array<MetaDataProperty>>(),
    metadataType: null,
    linkResourceTypes: new Map<string,string[]>(),
    secondMetadataType: null,
    secondMetadata: new Map<string, Array<MetaDataProperty>>()
  }
})
@Injectable()
export class MetaDataState {

  constructor(private metaDataApiService: MetaDataApiService, private resourceApiService: ResourceApiService) { }

  @Selector()
  public static loading(state: MetaDataStateModel) {
    return state.loading;
  }

  @Selector()
  public static actualMetadata(state: MetaDataStateModel): Array<MetaDataProperty> {
    return state.metadata.has(state.metadataType) ? state.metadata.get(state.metadataType) : new Array<MetaDataProperty>();
  }

  @Selector()
  public static actualMetadataHasMainDistributionEndpoint(state: MetaDataStateModel): boolean {
    return this.actualMetadata(state).some(m => m.key === Constants.Metadata.MainDistribution);
  }

  @Selector()
  public static metadata(state: MetaDataStateModel): Map<string, Array<MetaDataProperty>> {
    return state.metadata;
  }

  @Selector()
  public static actualSecondMetadata(state: MetaDataStateModel): Array<MetaDataProperty> {
    return state.secondMetadata.has(state.secondMetadataType) ? state.secondMetadata.get(state.secondMetadataType) : null;
  }

  @Selector()
  public static hierarchy(state: MetaDataStateModel) {
    return state.hierarchy;
  }

  @Selector()
  public static linkResourcesTypes(state: MetaDataStateModel) {
    return state.linkResourceTypes;
  }

  @Action(FetchHierarchy)
  fetchHierarchy({ patchState }: StateContext<MetaDataStateModel>, { }: FetchHierarchy) {
    this.metaDataApiService.getResourceTypes().subscribe(res => {
      patchState({
        hierarchy: res,
      });
    });
  }

  @Action(ClearActiveSecondMetaData)
  clearSecondMetaData({ patchState }: StateContext<MetaDataStateModel>, { }: ClearActiveSecondMetaData) {
    patchState({
      secondMetadataType: null,
      secondMetadata: new Map<string, Array<MetaDataProperty>>()
    });
  }

  @Action(FetchMetadata)
  fetchMetadata(ctx: StateContext<MetaDataStateModel>, action: FetchMetadata) {
    const state = ctx.getState();
    if (state.metadataType === action.entityType && state.metadata.has(action.entityType)) {
      return;
    }

    this.initializeState(ctx);

    this.metaDataApiService.getMetaData(action.entityType).subscribe(res => {

      var metadataMap = ctx.getState().metadata;
      metadataMap.set(action.entityType, res);
      ctx.patchState({
        metadata: metadataMap,
        loading: false,
        metadataType: action.entityType
      });
    });
  }

  @Action(FetchSecondMetadata)
  fetchSecondMetadata(ctx: StateContext<MetaDataStateModel>, action: FetchMetadata) {
    const state = ctx.getState();
    if (state.secondMetadataType === action.entityType && state.secondMetadata.has(action.entityType)) {
      return;
    }

    this.initializeState(ctx);

    this.metaDataApiService.getMetaData(action.entityType).subscribe(res => {

      var metadataMap = ctx.getState().secondMetadata;
      metadataMap.set(action.entityType, res);
      ctx.patchState({
        secondMetadata: metadataMap,
        loading: false,
        secondMetadataType: action.entityType
      });
    });
  }

  @Action(FetchMetadataRelease)
  fetchMetadataRelease(ctx: StateContext<MetaDataStateModel>, action: FetchMetadataRelease): void {
    var state = ctx.getState();


    if (state.metadataType === action.entityType && state.metadata.has(action.metadataRelease)) {
      ctx.patchState({
        metadata: new Map([...state.metadata]),
        metadataType: action.entityType,
        loading: false
      });
      return
    }

    if (state.metadataType !== action.entityType) {
      this.initializeState(ctx);
    } else {
      ctx.patchState({
        loading: true
      });
    }

    this.metaDataApiService.getMetadataRelease(action.metadataRelease, action.entityType).subscribe(res => {
      const state = ctx.getState();
      var metadataMap = state.metadata;
      metadataMap.set(action.metadataRelease, res);

      ctx.patchState({
        metadata: new Map([...metadataMap]),
        metadataType: action.entityType,
        loading: false
      });
    });
  }

  @Action(FetchLinkResourcesTypesMetadata)
  fetchLinkResourcesTypesMetadata(
    ctx: StateContext<MetaDataStateModel>,
    action: FetchLinkResourcesTypesMetadata
  ) {
    var type = action.resourceType;
    this.resourceApiService.getResourceHierarchy(type)
    .subscribe(x=> {
      const state = ctx.getState();
      state.linkResourceTypes=x
      ctx.setState(
        state
      )})
  }

  private initializeState(ctx: StateContext<MetaDataStateModel>) {
    ctx.patchState({
      loading: true,
      metadata: new Map<string, Array<MetaDataProperty>>(),
      metadataType: null
    });
  }
}
