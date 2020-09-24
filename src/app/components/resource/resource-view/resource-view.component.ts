import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceState, ClearActiveResource, FetchResource, UnlinkResource, LinkResource, MarkResourceAsDeleted, DeleteResource } from 'src/app/state/resource.state';
import { UserInfoState, AddColidEntrySubscription, RemoveColidEntrySubscription } from 'src/app/state/user-info.state';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, of, combineLatest } from 'rxjs';
import { Resource } from 'src/app/shared/models/resources/resource';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/core/logging/log.service';
import { ResourceOverviewDTO } from 'src/app/shared/models/resources/resource-overview-dto';
import { FormItemInputLinkingDialogComponent } from '../../form-item/form-item-input/form-item-input-linking/form-item-input-linking-dialog/form-item-input-linking-dialog.component';
import { DeleteItemDialogComponent } from '../../../shared/components/delete-item-dialog/delete-item-dialog.component';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { Constants } from 'src/app/shared/constants';
import { ResourceExtension } from 'src/app/shared/extensions/resource.extension';
import { AuthConsumerGroupService } from 'src/app/modules/authentication/services/auth-consumer-group.service';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { HttpErrorResponse } from '@angular/common/http';
import { ColidEntrySubscriptionDto } from 'src/app/shared/models/user/colid-entry-subscription-dto';
import { ResourceLockedDialogComponent } from '../resource-dialogs/resource-locked-dialog/resource-locked-dialog.component';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';

enum FabMenuOptions {
  Subscribe = 1,
  Unsubscribe,
  DeleteDraft,
  MarkForDeletion,
  LinkResource,
  UnlinkResource,
  CreateNewVersion
}

@Component({
  selector: 'app-resource-view',
  templateUrl: './resource-view.component.html',
  styleUrls: ['./resource-view.component.scss']
})
export class ResourceViewComponent implements OnInit, OnDestroy {
  @Select(ResourceState.activeResource) activeResource$: Observable<Resource>;
  @Select(UserInfoState.getColidEntrySubscriptions) colidEntrySubscriptions$: Observable<ColidEntrySubscriptionDto[]>;

  authorizedForEdit: boolean;
  activeResource: Resource;

  activeResourceSubscription: Subscription;
  combineLatestSubscription: Subscription;
  routerEventSubscription: Subscription;
  fabResourceMenu: MatFabMenu[] = [];

  get isAuthorizedForDeleteDraft(): boolean {
    return ResourceExtension.isAuthorizedForDeleteDraft(this.activeResource);
  }

  get isAuthorizedForMarkForDeletion(): boolean {
    return ResourceExtension.isAuthorizedForMarkForDeletion(this.activeResource);
  }

  get isAllowedToUnlink() {
    return ResourceExtension.isAllowedToUnlink(this.activeResource);
  }

  constructor (
    private logger: LogService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: ColidMatSnackBarService,
    public dialog: MatDialog,
    private authService: AuthService,
    private authConsumerGroupService: AuthConsumerGroupService) {
    this.routerEventSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadResource();
      }
    });
  }

  ngOnInit() {
    this.activeResourceSubscription = this.activeResource$.subscribe(activeResource => {
      this.activeResource = activeResource;
    });

    this.buildFabMenu();
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearActiveResource()).subscribe();
    this.activeResourceSubscription.unsubscribe();
    this.combineLatestSubscription.unsubscribe();
    this.routerEventSubscription.unsubscribe();
  }

  buildFabMenu() {
    this.combineLatestSubscription = combineLatest(
      this.authConsumerGroupService.IsAuthorizedForEdit(),
      this.colidEntrySubscriptions$,
      this.activeResource$,
    ).subscribe(([isAuthorizedForEdit, colidEntrySubscriptions, activeResource]: [boolean, ColidEntrySubscriptionDto[], Resource]) => {
      if(isAuthorizedForEdit == null || activeResource == null) {
        return;
      }

      this.authorizedForEdit = isAuthorizedForEdit;
      this.fabResourceMenu = [];

      if (colidEntrySubscriptions != null) {
        const isSubscribed = colidEntrySubscriptions.some(ces => ces.colidPidUri === this.activeResource.pidUri)

        if (isSubscribed) {
          this.fabResourceMenu.push({id: FabMenuOptions.Unsubscribe, icon: 'notifications_active', tooltip: 'Unsubscribe from resource', tooltipPosition: 'left'});
        } else {
          this.fabResourceMenu.push({id: FabMenuOptions.Subscribe, icon: 'notifications_none', tooltip: 'Subscribe to resource', tooltipPosition: 'left'});
        }
      }

      // Add the buttons to the sub menu only, if the user is an authorized editor
      if(this.authorizedForEdit) {
        if(this.isAuthorizedForDeleteDraft) {
          this.fabResourceMenu.push({id: FabMenuOptions.DeleteDraft, icon: 'delete', tooltip: 'Delete draft', tooltipPosition: 'left'});
        }

        if(this.isAuthorizedForMarkForDeletion) {
          this.fabResourceMenu.push({id: FabMenuOptions.MarkForDeletion, icon: 'delete_forever', tooltip: 'Mark for deletion', tooltipPosition: 'left'});
        }

        if(!this.activeResource.laterVersion && !this.activeResource.previousVersion) {
          this.fabResourceMenu.push({id: FabMenuOptions.LinkResource, icon: 'link', tooltip: 'Link resource', tooltipPosition: 'left'});
        }

        if(this.isAllowedToUnlink) {
          this.fabResourceMenu.push({id: FabMenuOptions.UnlinkResource, icon: 'link_off', tooltip: 'Unlink resource', tooltipPosition: 'left'});
        }

        if(!this.activeResource.laterVersion) {
          this.fabResourceMenu.push({id: FabMenuOptions.CreateNewVersion, icon: 'dynamic_feed', tooltip: 'Create new version', tooltipPosition: 'left'});
        }
      }

      return { isAuthorizedForEdit, colidEntrySubscriptions, activeResource };
    });
  }

  onFabMenuItemSelected(buttonId) {
    switch(buttonId) {
      case FabMenuOptions.Subscribe: {
         this.subscribeToResource();
         break;
      }
      case FabMenuOptions.Unsubscribe: {
         this.unsubscribeFromResource();
         break;
      }
      case FabMenuOptions.DeleteDraft: {
         this.confirmAndDelete();
         break;
      }
      case FabMenuOptions.MarkForDeletion: {
         this.markResourceForDeletion();
         break;
      }
      case FabMenuOptions.LinkResource: {
         this.showLinkingResourceDialog();
         break;
      }
      case FabMenuOptions.UnlinkResource: {
         this.unlinkResource();
         break;
      }
      case FabMenuOptions.CreateNewVersion: {
         this.createNewVersion();
         break;
      }
      case 5: {
        this.createNewVersion();
        break;
      }
    }
  }

  loadResource() {
    let activePidUri = this.route.snapshot.queryParamMap.get('pidUri');
    this.logger.info('PID_RESOURCE_DISPLAY_OPENED', { 'resourcePidUri': activePidUri });

    if (this.activeResource != null && activePidUri === this.activeResource.pidUri) {
      return;
    }

    if (activePidUri == null) {
      this.router.navigate(['resource', 'welcome']);
    }

    this.store.dispatch([new ClearActiveResource(), new FetchResource(activePidUri, false)]).subscribe();
  }

  subscribeToResource() {
    let colidEntrySubscriptionDto = new ColidEntrySubscriptionDto(this.activeResource.pidUri);
    this.store.dispatch(new AddColidEntrySubscription(colidEntrySubscriptionDto)).subscribe(() => {
      this.snackbar.success('Resource subscribed', 'You have successfully subscribed the resource.');
    });
  }

  unsubscribeFromResource() {
    let colidEntrySubscriptionDto = new ColidEntrySubscriptionDto(this.activeResource.pidUri);
    this.store.dispatch(new RemoveColidEntrySubscription(colidEntrySubscriptionDto)).subscribe(() => {
      this.snackbar.success('Resource unsubscribed', 'You have successfully unsubscribed to the resource.');
    });
  }

  createNewVersion() {
    const resourceType = this.activeResource.properties[Constants.Metadata.EntityType];
    this.router.navigate(['resource', 'new'], { queryParams: { type: resourceType[0], previousVersion: this.activeResource.pidUri } });
  }

  showLinkingResourceDialog() {
    const dialogRef = this.dialog.open(FormItemInputLinkingDialogComponent, {
      width: '700px',
      height: 'calc(100vh - 200px)',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: ResourceOverviewDTO) => {
      if (result) {
        this.linkResource(result.pidUri);
      }
    });
  }

  linkResource(selectedResourceForLinking: string) {
    this.store.dispatch(new LinkResource(this.activeResource.pidUri, selectedResourceForLinking)).subscribe(() => {
      this.snackbar.success('Resource linked', 'The resource has been linked successfully with the selected resource.');
    }, error => {
      this.handleHttpErrorResponse(error);
    });
  }

  unlinkResource() {
    this.store.dispatch(new UnlinkResource(this.activeResource.pidUri)).subscribe(() => {
      this.snackbar.success('Resource unlinked', 'The resource has been unlinked from the list successfully.');
    }, error => {
      this.handleHttpErrorResponse(error);
    });
  }

  editResource() {
    this.router.navigate(['/resource', 'edit'], { queryParams: { pidUri: this.activeResource.pidUri } });
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteResource();
      }
    });
  }

  deleteResource() {
    this.store.dispatch(new DeleteResource(this.activeResource.pidUri)).subscribe(() => {
      const hasPublishedResource = this.activeResource.publishedVersion;
      this.activeResource = null;
      if (hasPublishedResource) {
        this.loadResource();
      } else {
        this.router.navigate(['resource', 'welcome']);
      }
      this.snackbar.success('COLID entry deleted', 'Deleted successfully.');
    }, error => {
      this.handleHttpErrorResponse(error);
    });
  }

  markResourceForDeletion() {
    const currentEmail = this.authService.currentEmail;
    const currentPidUri = this.activeResource.pidUri;
    this.store.dispatch(new MarkResourceAsDeleted(currentPidUri, currentEmail)).subscribe(() => {
      this.snackbar.success('Resource marked for deletion', 'The resource has been marked for deletion. An administrator will review your request soon.');
    }, error => {
      this.handleHttpErrorResponse(error);
    });
  }

  handleHttpErrorResponse(error: HttpErrorResponse) {
    if (error.status === 423) {
      this.handleItemLocked(error);
    }
  }

  handleItemLocked(error: HttpErrorResponse) {
    const dialogRef = this.dialog.open(ResourceLockedDialogComponent, {
      width: 'auto', disableClose: true
    });
  }

  get lifeCycleStatus(): string {
    return this.activeResource.properties[Constants.Metadata.LifeCycleStatus][0];
  }

  get currentLifeCycleStatus() {
    switch (this.lifeCycleStatus) {
      case Constants.Resource.LifeCycleStatus.Draft:
        return 'Draft';
      case Constants.Resource.LifeCycleStatus.Published:
        return 'Published';
      case Constants.Resource.LifeCycleStatus.MarkedDeletion:
        return 'Marked For Deletion';
      default:
        return '';
    }
  }

  get isDraft() {
    return this.lifeCycleStatus === Constants.Resource.LifeCycleStatus.Draft;
  }

  get isPublished() {
    return this.lifeCycleStatus === Constants.Resource.LifeCycleStatus.Published;
  }

  get isMarkedForDeletion() {
    return this.lifeCycleStatus === Constants.Resource.LifeCycleStatus.MarkedDeletion;
  }
}
