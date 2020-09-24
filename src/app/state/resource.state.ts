import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { ResourceApiService } from '../core/http/resource.api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { LogService } from '../core/logging/log.service';
import { Resource } from '../shared/models/resources/resource';
import { Entity } from '../shared/models/Entities/entity';
import { ResourceOverviewCTO } from '../shared/models/resources/resource-overview-cto';
import { ResourceSearchDTO } from '../shared/models/search/resource-search-dto';
import { HistoricResourceOverviewDTO } from '../shared/models/resources/historic-resource-overview-dto';
import { Constants } from '../shared/constants';
import { FetchSidebarResourceOverview } from './resource-overview.state';
import { FetchMetadata, FetchMetadataRelease } from './meta-data.state';
import { forkJoin, of, pipe } from 'rxjs';
import { ResourceExtension } from '../shared/extensions/resource.extension';

export class FetchResource {
  static readonly type = '[Resource] Fetch';

  constructor(public pidUri: string, public latestMetadata: boolean) { }
}

export class FetchPublishedResourceWithMetaData {
  static readonly type = '[PublishedResourceWithMetaData] Fetch';

  constructor(public payload: string) { }
}

export class CreateResource {
  static readonly type = '[Resource] Create';
}

export class ClearActiveResource {
  static readonly type = '[Resource] Clear';
}

export class FetchResourceMarkedAsDeleted {
  static readonly type = '[Resource] FetchMarkedDeleted';
}

export class FetchResourceHistory {
  static readonly type = '[Resource] FetchResourceHistory';
  constructor(public pidUri: string) { }
}

export class FetchHistoricResource {
  static readonly type = '[Resource] FetchHistoricResource';
  constructor(public historicResource: HistoricResourceOverviewDTO) { }
}

export class DeleteResource {
  static readonly type = '[Resource] Delete';
  constructor(public payload: string) { }
}

export class DeleteResources {
  static readonly type = '[Resources] Delete';
  constructor(public payload: string[]) { }
}

export class MarkResourceAsDeleted {
  static readonly type = '[Resource] MarkAsDeleted';
  constructor(public pidUri: string, public requester: string) { }
}

export class RejectResourceMarkedAsDeleted {
  static readonly type = '[Resource] RejectMarkedAsDeleted';
  constructor(public payload: string[]) { }
}

export class LinkResource {
  static readonly type = '[Resource] Link';
  constructor(public pidUri: string, public pidUriToLink) { }
}

export class UnlinkResource {
  static readonly type = '[Resource] Unlink';
  constructor(public pidUri: string) { }
}

export class SetMainDistribution {
  static readonly type = '[Resource] SetMainDistribution';

  constructor(public mainDistributionId: string) { }
}

export class SetActiveResource {
  static readonly type = '[Resource] SetActiveResource';
  constructor(public resource: Resource) { }
}

export class ResourceStateModel {
  activeResource: Resource;
  fetched: boolean;
  loadingMarked: boolean;
  markedResource: ResourceOverviewCTO;
  activeMainDistribution: string;
  history: Array<HistoricResourceOverviewDTO>;
  historicResources: Map<string, Resource>;
  selectedHistoricResource: string;
}

@State<ResourceStateModel>({
  name: 'resource',
  defaults: {
    fetched: false,
    activeResource: null,
    activeMainDistribution: null,
    loadingMarked: false,
    markedResource: null,
    history: null,
    selectedHistoricResource: null,
    historicResources: new Map<string, Resource>()
  }
})

export class ResourceState {
  constructor(private logger: LogService, private resourceService: ResourceApiService, private store: Store, private router: Router) {
  }

  @Selector()
  public static getIsResourcesMarkedDeletedLoading(state: ResourceStateModel) {
    return state.loadingMarked;
  }

  @Selector()
  public static getResourcesMarkedDeleted(state: ResourceStateModel) {
    return state.markedResource;
  }

  @Selector()
  public static activeResource(state: ResourceStateModel) {
    return state.activeResource;
  }

  @Selector()
  public static getIsFetched(state: ResourceStateModel) {
    return state.fetched;
  }

  @Selector()
  public static getActiveMainDistribution(state: ResourceStateModel) {
    return state.activeMainDistribution;
  }

  @Selector()
  public static getResourceHistory(state: ResourceStateModel) {
    return state.history;
  }

  @Selector()
  public static getHistoricResources(state: ResourceStateModel) {
    return state.historicResources;
  }

  @Selector()
  public static getSelectedHistoricResource(state: ResourceStateModel) {
    return state.selectedHistoricResource;
  }

  @Action(ClearActiveResource)
  ClearActiveResource({ patchState }: StateContext<ResourceStateModel>, { }: ClearActiveResource) {
    patchState({
      fetched: false,
      activeMainDistribution: null,
      activeResource: null,
      history: null,
      selectedHistoricResource: null,
      historicResources: new Map<string, Resource>()
    });
  }

  @Action(FetchResource)
  fetchResource(ctx: StateContext<ResourceStateModel>, action: FetchResource) {
    ctx.dispatch(new ClearActiveResource());
    this.resourceService.getResourcesByPidUri(action.pidUri).subscribe(
      (res) => {
        const resourceType = this.returnResourceTypeFromProperties(res.properties)[0];
        const resourceConfig = res.properties[Constants.Metadata.MetadataReleaseConfig][0];

        if (action.latestMetadata) {
          ctx.dispatch(new FetchMetadata(resourceType)).subscribe(() => {
            this.patchState(ctx, res);
          });
        } else {
          ctx.dispatch(new FetchMetadataRelease(resourceType, resourceConfig)).subscribe(() => {
            this.patchState(ctx, res);
          });
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.logger.log('Resource not found: ' + action.pidUri);
          this.router.navigate(['resource', 'welcome']);
        }
      }
    );
  }

  @Action(FetchPublishedResourceWithMetaData)
  fetchPublishedResourceWithMetaData(ctx: StateContext<ResourceStateModel>, { payload }: FetchPublishedResourceWithMetaData) {
    this.resourceService.getPublishedResourcesByPidUri(payload).subscribe(
      (res) => {
        const resourceType = this.returnResourceTypeFromProperties(res.properties)[0];
        const resourceConfig = res.properties[Constants.Metadata.MetadataReleaseConfig][0];

        this.store.dispatch(new FetchMetadataRelease(resourceType, resourceConfig)).subscribe(() => {
          this.patchState(ctx, res);
        });
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.logger.log('Resource not found: ' + payload);
          this.router.navigate(['resource', 'welcome']);
        }
      }
    );
  }

  private patchState(ctx: StateContext<ResourceStateModel>, resource: Resource) {
    const result = this.transformResourceAndGetMainDistribution(resource);
    ctx.patchState({
      fetched: true,
      activeResource: result.resource,
      activeMainDistribution: result.mainDistribution
    });
  }

  private returnResourceTypeFromProperties(properties: { [id: string]: any[]; }): string[] {
    return properties[Constants.Metadata.EntityType];
  }

  private returnMetadataReleaseFromProperties(properties: { [id: string]: any[]; }): string[] {
    return properties[Constants.Metadata.MetadataReleaseConfig];
  }

  private transformResourceAndGetMainDistribution(resource: Resource) {
    let mainDistribution: string;

    if (resource.properties[Constants.Metadata.MainDistribution] != null && resource.properties[Constants.Metadata.MainDistribution].length) {
      const mainDistributionEndpoint: Entity = resource.properties[Constants.Metadata.MainDistribution][0];
      mainDistribution = mainDistributionEndpoint.id;
    }

    return { resource: resource, mainDistribution: mainDistribution };
  }

  @Action(CreateResource)
  createResource({ patchState }: StateContext<ResourceStateModel>, { }: CreateResource) {
    patchState({
      fetched: true,
      activeResource: new Resource()
    });
  }

  @Action(FetchResourceHistory)
  fetchResourceHistory(ctx: StateContext<ResourceStateModel>, action: FetchResourceHistory) {
    const state = ctx.getState();
    if (state.history != null) {
      return;
    };

    const activeResource = state.activeResource;

    const forkJoinObject = {};

    if (!activeResource || (activeResource && activeResource.publishedVersion)) {
      forkJoinObject['publishedResource'] = this.resourceService.getPublishedResourcesByPidUri(action.pidUri).pipe(catchError(error => of(null)));
    }

    forkJoinObject['history'] = this.resourceService.getResourceHistory(action.pidUri).pipe(catchError(error => of(null)));

    forkJoin(forkJoinObject).subscribe({
      next: observables => {
        let history: Array<HistoricResourceOverviewDTO> = observables['history'] == null ? [] : observables['history'];
        const publishedResource: Resource = observables['publishedResource'];

        if (publishedResource != null && ResourceExtension.hasDraftVersion(publishedResource)) {
          const overviewPublished = ResourceExtension.createHistoricOverviewByResource(observables['publishedResource']);
          history.unshift(overviewPublished)
        }

        ctx.patchState({
          history: history,
          selectedHistoricResource: history.length === 0 ? null : ctx.getState().selectedHistoricResource
        });
      }
    });
  }

  @Action(FetchHistoricResource)
  fetchHistoricResource({ getState, patchState }: StateContext<ResourceStateModel>, action: FetchHistoricResource) {
    let historicResources = getState().historicResources;

    patchState({
      selectedHistoricResource: action.historicResource.id
    });

    if (historicResources.has(action.historicResource.id)) {
      return;
    }


    const observable = action.historicResource.lifeCycleStatus === Constants.Resource.LifeCycleStatus.Published ?
      this.resourceService.getPublishedResourcesByPidUri(action.historicResource.pidUri) :
      this.resourceService.getHistoricResource(action.historicResource.id, action.historicResource.pidUri)

    observable.subscribe(
      (res) => {
        const resourceType = this.returnResourceTypeFromProperties(res.properties)[0];
        const resouceMetadataRelease = this.returnMetadataReleaseFromProperties(res.properties)[0];

        this.store.dispatch(new FetchMetadataRelease(resourceType, resouceMetadataRelease)).subscribe(() => {
          let historicResources = getState().historicResources;
          historicResources.set(action.historicResource.id, res)
          patchState({
            historicResources: historicResources
          });
        });
      }
    );
  }

  @Action(SetActiveResource)
  setActiveResource({ patchState }: StateContext<ResourceStateModel>, { resource }: SetActiveResource) {
    const result = this.transformResourceAndGetMainDistribution(resource);
    patchState({
      fetched: true,
      activeResource: result.resource,
      activeMainDistribution: result.mainDistribution
    });
  }

  @Action(FetchResourceMarkedAsDeleted)
  fetchResourceMarkedAsDeleted({ patchState }: StateContext<ResourceStateModel>, { }: FetchResourceMarkedAsDeleted) {
    patchState({
      loadingMarked: true
    });

    const searchObject = new ResourceSearchDTO();
    searchObject.markedForDeletion = true;
    searchObject.limit = 1000;

    this.resourceService.getFilteredResources(searchObject).subscribe(res => {
      patchState({
        markedResource: res,
        loadingMarked: false
      });
    });
  }

  @Action(RejectResourceMarkedAsDeleted)
  rejectResourceMarkedAsDeleted({ patchState, dispatch }: StateContext<ResourceStateModel>, { payload }: RejectResourceMarkedAsDeleted) {
    patchState({
      loadingMarked: true
    });
    return this.resourceService.rejectResourcesMarkedDeleted(payload).pipe(
      tap(
        () => dispatch(new FetchResourceMarkedAsDeleted()),
        error => {
          patchState({
            loadingMarked: false
          });
        })
    );
  }

  @Action(DeleteResource)
  deleteResource({ patchState, dispatch }: StateContext<ResourceStateModel>, { payload }: DeleteResource) {
    patchState({
      loadingMarked: true
    });
    return this.resourceService.deleteResource(payload).pipe(
      tap(
        () => dispatch( [new FetchResourceMarkedAsDeleted(), new FetchSidebarResourceOverview()]),
        error => {
          patchState({
            loadingMarked: false
          });
        })
    );
  }

  @Action(DeleteResources)
  deleteResources({ patchState, dispatch }: StateContext<ResourceStateModel>, { payload }: DeleteResources) {
    patchState({
      loadingMarked: true
    });
    return this.resourceService.deleteResources(payload).pipe(
      tap(() => dispatch(
        [new FetchResourceMarkedAsDeleted(), new FetchSidebarResourceOverview()]))
    );
  }

  @Action(MarkResourceAsDeleted)
  markResourceAsDeleted({ dispatch }: StateContext<ResourceStateModel>, action: MarkResourceAsDeleted) {
    return this.resourceService.markResourceAsDeleted(action.pidUri, action.requester).pipe(
      tap(() => dispatch(
        [new FetchResource(action.pidUri, false), new FetchSidebarResourceOverview()]))
    );
  }

  @Action(LinkResource)
  linkResource({ dispatch }: StateContext<ResourceStateModel>, { pidUri, pidUriToLink }: LinkResource) {
    return this.resourceService.linkResource(pidUri, pidUriToLink).pipe(
      tap(() => dispatch(
        [new FetchResource(pidUri, false)]))
    );
  }

  @Action(UnlinkResource)
  unlinkResource({ dispatch }: StateContext<ResourceStateModel>, { pidUri }: UnlinkResource) {
    return this.resourceService.unlinkResource(pidUri).pipe(
      tap(() => dispatch(
        [new FetchResource(pidUri, false)]))
    );
  }

  @Action(SetMainDistribution)
  setMainDistribution({ getState, patchState }: StateContext<ResourceStateModel>, { mainDistributionId }: SetMainDistribution) {
    const activeMainDistribution = getState().activeMainDistribution;
    patchState({
      activeMainDistribution: activeMainDistribution === mainDistributionId ? null : mainDistributionId
    });
  }
}
