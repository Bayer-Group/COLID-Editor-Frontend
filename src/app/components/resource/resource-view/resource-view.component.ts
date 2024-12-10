import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {
  ResourceState,
  ClearActiveResource,
  FetchResource,
  LinkResource,
  UnlinkResource,
  DeleteResource,
  MarkResourceAsDeleted
} from 'src/app/state/resource.state';
import { UserInfoState } from 'src/app/state/user-info.state';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, combineLatest, map } from 'rxjs';
import { Resource } from 'src/app/shared/models/resources/resource';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/core/logging/log.service';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { Constants } from 'src/app/shared/constants';
import { AuthConsumerGroupService } from 'src/app/modules/authentication/services/auth-consumer-group.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ColidEntrySubscriptionDto } from 'src/app/shared/models/user/colid-entry-subscription-dto';
import { ResourceLockedDialogComponent } from '../resource-dialogs/resource-locked-dialog/resource-locked-dialog.component';
import { FormItemInputLinkingDialogComponent } from '../../form-item/form-item-input/form-item-input-linking/form-item-input-linking-dialog/form-item-input-linking-dialog.component';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { ColidEntrySubscriberCountState } from 'src/app/state/colid-entry-subcriber-count.state';
import { EntityFormStatus } from 'src/app/shared/components/entity-form/entity-form-status';
import { HostListener } from '@angular/core';
import { ResourceHierarchyComponent } from '../resource-hierarchy/resource-hierarchy.component';
import { ResourceExtension } from 'src/app/shared/extensions/resource.extension';
import { ResourceCreationType } from 'src/app/shared/models/resources/resource-creation-type';
import { DeleteItemDialogComponent } from 'src/app/shared/components/delete-item-dialog/delete-item-dialog.component';
import { FetchSidebarResourceOverview } from 'src/app/state/resource-overview.state';

export enum ResourceViewAction {
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
  DELETE = 'delete',
  MARKFORDELETION = 'markForDeletion',
  LINK = 'link',
  UNLINK = 'unlink'
}

@Component({
  selector: 'app-resource-view',
  templateUrl: './resource-view.component.html',
  styleUrls: ['./resource-view.component.scss']
})
export class ResourceViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @Select(ResourceState.activeResource) activeResource$: Observable<Resource>;
  @Select(UserInfoState.getColidEntrySubscriptions)
  colidEntrySubscriptions$: Observable<ColidEntrySubscriptionDto[]>;
  @Select(ColidEntrySubscriberCountState.getSubscriptionNumbers)
  colidEntrySubscriptionNumber$: Observable<ColidEntrySubscriptionDto>;

  activeResource: Resource;
  resourceSubNumbers: ColidEntrySubscriptionDto;
  isSubscribed: boolean;
  windowSize: number = 1024;
  actionBarOpened: boolean = false;

  status: EntityFormStatus = EntityFormStatus.INITIAL;
  action: ResourceViewAction;

  ResourceNumSubscription: Subscription;
  activeResourceSubscription: Subscription;
  combineLatestSubscription: Subscription;
  routerEventSubscription: Subscription;
  userEmail: string;

  key = Constants.Metadata.HasLabel;

  get isAuthorizedToEdit$(): Observable<boolean> {
    return this.authConsumerGroupService.IsAuthorizedToEdit();
  }

  get isAuthorizedToDeleteDraft(): boolean {
    return ResourceExtension.isAuthorizedToDeleteDraft(this.activeResource);
  }

  get isAuthorizedToMarkForDeletion(): boolean {
    return ResourceExtension.isAuthorizedToMarkForDeletion(this.activeResource);
  }

  get isAllowedToUnlink() {
    return ResourceExtension.isAllowedToUnlink(this.activeResource);
  }

  get isAllowedCreateNewVersion() {
    return !this.activeResource.laterVersion;
  }

  get isResourceSubscribed(): boolean {
    return this.isSubscribed;
  }

  get getNumSubscribers(): number {
    return this.resourceSubNumbers == null
      ? 0
      : this.resourceSubNumbers.subscriptions;
  }

  get isLoading(): boolean {
    return this.status === EntityFormStatus.LOADING;
  }

  @HostListener('window:resize', [])
  private onResize() {
    this.detectScreenSize();
  }

  ngAfterViewInit() {
    this.detectScreenSize();
  }

  private detectScreenSize() {
    this.windowSize = window.innerWidth;
  }

  constructor(
    private logger: LogService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: ColidMatSnackBarService,
    public dialog: MatDialog,
    private authService: AuthService,
    private authConsumerGroupService: AuthConsumerGroupService
  ) {
    this.routerEventSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadResource();
      }
    });
  }

  ngOnInit() {
    this.loadResource();
    this.activeResourceSubscription = this.activeResource$.subscribe(
      (activeResource) => {
        this.activeResource = activeResource;
      }
    );
    this.ResourceNumSubscription = this.colidEntrySubscriptionNumber$.subscribe(
      (x) => {
        this.resourceSubNumbers = x;
      }
    );
    this.buildMenu();
    this.authService.currentEmail$.subscribe(
      (userEmail) => (this.userEmail = userEmail)
    );
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearActiveResource()).subscribe();
    this.activeResourceSubscription.unsubscribe();
    this.ResourceNumSubscription.unsubscribe();
    this.combineLatestSubscription.unsubscribe();
    this.routerEventSubscription.unsubscribe();
  }

  isActionLoading(action: string) {
    return this.isLoading && action === this.action;
  }

  buildMenu() {
    this.combineLatestSubscription = combineLatest([
      this.colidEntrySubscriptions$,
      this.activeResource$
    ]).subscribe(
      ([colidEntrySubscriptions, activeResource]: [
        ColidEntrySubscriptionDto[],
        Resource
      ]) => {
        if (activeResource == null) {
          return;
        }

        if (colidEntrySubscriptions != null) {
          this.isSubscribed = colidEntrySubscriptions.some(
            (ces) => ces.colidPidUri === this.activeResource.pidUri
          );
        }

        return { colidEntrySubscriptions, activeResource };
      }
    );
  }

  loadResource() {
    let activePidUri = this.route.snapshot.queryParamMap?.get('pidUri');
    let openLinkingDialog =
      this.route.snapshot.queryParamMap?.get('openLinkingDialog');
    let openChangeResourceTypeDialog = this.route.snapshot.queryParamMap?.get(
      'openChangeResourceTypeDialog'
    );
    this.logger.info('PID_RESOURCE_DISPLAY_OPENED', {
      resourcePidUri: activePidUri
    });

    if (
      this.activeResource != null &&
      activePidUri === this.activeResource.pidUri
    ) {
      return;
    }

    if (activePidUri == null) {
      this.router.navigate(['resource', 'welcome']);
    }

    this.store
      .dispatch([
        new ClearActiveResource(),
        new FetchResource(activePidUri, false)
      ])
      .subscribe(() => {
        if (openLinkingDialog) {
          this.showLinkingResourceDialog();
        }
        if (openChangeResourceTypeDialog) {
          this.changeResourceType();
        }
      });
  }

  createNewVersion() {
    const resourceType =
      this.activeResource.properties[Constants.Metadata.EntityType];
    this.router.navigate(['resource', 'new'], {
      queryParams: {
        type: resourceType[0],
        based: this.activeResource.pidUri,
        creationType: ResourceCreationType.NEWVERSION
      }
    });
  }

  copyResource() {
    const resourceType =
      this.activeResource.properties[Constants.Metadata.EntityType];
    this.router.navigate(['resource', 'hierarchy'], {
      queryParams: {
        type: resourceType[0],
        based: this.activeResource.pidUri,
        creationType: ResourceCreationType.COPY
      }
    });
  }

  showLinkingResourceDialog() {
    const dialogRef = this.dialog.open(FormItemInputLinkingDialogComponent, {
      width: '700px',
      height: '80vh',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.linkResource(result);
      }
    });
  }

  linkResource(selectedResourceForLinking: string) {
    this.status = EntityFormStatus.LOADING;
    this.action = ResourceViewAction.LINK;

    this.store
      .dispatch(
        new LinkResource(this.activeResource.pidUri, selectedResourceForLinking)
      )
      .subscribe({
        next: () => {
          this.snackbar.success(
            'Resource linked',
            'The resource has been linked successfully with the selected resource.'
          );
          this.status = EntityFormStatus.SUCCESS;
        },
        error: (error) => {
          this.handleHttpErrorResponse(error);
        }
      });
  }

  unlinkResource() {
    this.status = EntityFormStatus.LOADING;
    this.action = ResourceViewAction.UNLINK;

    this.store
      .dispatch(new UnlinkResource(this.activeResource.pidUri))
      .subscribe({
        next: () => {
          this.snackbar.success(
            'Resource unlinked',
            'The resource has been unlinked from the list successfully.'
          );
          this.status = EntityFormStatus.SUCCESS;
        },
        error: (error) => {
          this.handleHttpErrorResponse(error);
        }
      });
  }

  changeResourceType() {
    const dialogRef = this.dialog.open(ResourceHierarchyComponent, {
      // minWidth: '80vw',
      width: '60em',
      height: '60em',
      // minHeight: '80vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // alert(result.id);
        // this.store.dispatch(new FetchSecondMetadata(result.id));
        this.router.navigate(['/resource', 'edit'], {
          queryParams: {
            pidUri: this.activeResource.pidUri,
            typeUri: result.id
          }
        });
      }
    });
  }

  editResource() {
    this.router.navigate(['/resource', 'edit'], {
      queryParams: { pidUri: this.activeResource.pidUri }
    });
  }

  confirmAndDelete() {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: 'Deleting COLID entry draft',
        body: 'Are you sure that you want to delete this COLID entry draft?'
      },
      width: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteResource();
      }
    });
  }

  deleteResource() {
    this.status = EntityFormStatus.LOADING;
    this.action = ResourceViewAction.DELETE;
    this.store
      .dispatch(new DeleteResource(this.activeResource.pidUri, this.userEmail))
      .subscribe({
        next: () => {
          const hasPublishedResource = this.activeResource.publishedVersion;
          this.activeResource = null;
          if (hasPublishedResource) {
            this.loadResource();
          } else {
            this.router.navigate(['resource', 'welcome']);
          }
          this.status = EntityFormStatus.SUCCESS;
          this.snackbar.success('COLID entry deleted', 'Deleted successfully.');
          this.store
            .dispatch(new FetchSidebarResourceOverview(true))
            .subscribe((res) => res);
        },
        error: (error) => {
          this.handleHttpErrorResponse(error);
        }
      });
  }

  markResourceForDeletion() {
    this.status = EntityFormStatus.LOADING;
    this.action = ResourceViewAction.MARKFORDELETION;

    const currentPidUri = this.activeResource.pidUri;
    this.authService.currentEmail$
      .pipe(
        map((currentEmail$) =>
          this.store.dispatch(
            new MarkResourceAsDeleted(currentPidUri, currentEmail$)
          )
        )
      )
      .subscribe({
        next: () => {
          this.snackbar.success(
            'Resource marked for deletion',
            'The resource has been marked for deletion. An administrator will review your request soon.'
          );
          this.status = EntityFormStatus.SUCCESS;
        },
        error: (error) => {
          this.handleHttpErrorResponse(error);
        }
      });
  }

  handleHttpErrorResponse(error: HttpErrorResponse) {
    this.status = EntityFormStatus.ERROR;

    if (error.status === 423) {
      this.handleItemLocked(error);
    }
  }

  handleItemLocked(_: HttpErrorResponse) {
    this.dialog.open(ResourceLockedDialogComponent, {
      width: 'auto',
      disableClose: true
    });
  }

  get lifeCycleStatus(): string {
    if (Object.keys(this.activeResource.properties).length > 0) {
      return this.activeResource.properties[
        Constants.Metadata.LifeCycleStatus
      ][0];
    }
    return null;
  }

  get isDraft() {
    return this.lifeCycleStatus === Constants.Resource.LifeCycleStatus.Draft;
  }

  get isPublished() {
    return (
      this.lifeCycleStatus === Constants.Resource.LifeCycleStatus.Published
    );
  }

  get isMarkedForDeletion() {
    return (
      this.lifeCycleStatus === Constants.Resource.LifeCycleStatus.MarkedDeletion
    );
  }
}
