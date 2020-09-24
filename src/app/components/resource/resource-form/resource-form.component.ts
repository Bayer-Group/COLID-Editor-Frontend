import { Select, Store } from '@ngxs/store';
import { ResourceState, SetActiveResource, ClearActiveResource, SetMainDistribution, FetchPublishedResourceWithMetaData } from '../../../state/resource.state';
import { OnInit, Input, Component, OnDestroy, ElementRef } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { MetaDataProperty } from '../../../shared/models/metadata/meta-data-property';
import { MetaDataState, ClearMetaData } from '../../../state/meta-data.state';
import { LogService } from '../../../core/logging/log.service';
import { ResourceApiService } from '../../../core/http/resource.api.service';
import { Router } from '@angular/router';
import { ResourceFormService, OPERATION } from './resource-form.service';
import { MetaDataPropertyIdentifier } from './resource-form.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ResourceWriteResultCTO } from 'src/app/shared/models/resources/resource-write-result-cto';
import { ResourceRequestDTO } from 'src/app/shared/models/resources/requests/resource-request-dto';
import { Constants } from 'src/app/shared/constants';
import { ConsumerGroupPidUriTemplateMetaSelector } from 'src/app/state/consumer-group.state';
import { PidUriTemplateState } from 'src/app/state/pid-uri-template.state';
import { UserInfoState } from 'src/app/state/user-info.state';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { ValidationResultProperty, ValidationResultPropertyType } from 'src/app/shared/models/validation/validation-result-property';
import { FormChangedDTO } from 'src/app/shared/models/form/form-changed-dto';
import { Guid } from 'guid-typescript';
import { Resource } from '../../../shared/models/resources/resource';
import { PidUriTemplateResultDTO } from 'src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto';
import { MatDialog } from '@angular/material/dialog';
import { ResourceFormSecretDialogComponent } from './resource-form-secret-dialog/resource-form-secret-dialog.component';
import { SetResourceFormTouched } from 'src/app/state/resource-form.state';
import { MetaDataPropertyGroup } from 'src/app/shared/models/metadata/meta-data-property-group';
import { ResourceExtension } from 'src/app/shared/extensions/resource.extension';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { FetchSidebarResourceOverview } from 'src/app/state/resource-overview.state';
import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { DynamicOverlay } from 'src/app/shared/services/overlay/dynamic-overlay';
import { FetchTaxonomyList } from 'src/app/state/taxonomy.state';
import { ResourceLockedDialogComponent } from '../resource-dialogs/resource-locked-dialog/resource-locked-dialog.component';
import { ComponentCanDeactivate } from 'src/app/core/guards/can-deactivate/can-deactivate.component';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { ValidationResultSeverity } from 'src/app/shared/models/validation/validation-result-severity';
;

@Component({
  selector: 'app-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.css']
})
export class ResourceFormComponent extends ComponentCanDeactivate implements OnInit, OnDestroy {
  @Select(ResourceState.activeResource) activeResource$: Observable<Resource>;
  @Select(ResourceState.getActiveMainDistribution) activeMainDistribution$: Observable<string>;

  @Select(MetaDataState.actualMetadata) metaData$: Observable<MetaDataProperty[]>;
  @Select(PidUriTemplateState.getPidUriTemplatesFetched) pidUriTemplatesFetched$: Observable<boolean>;
  @Select(ConsumerGroupPidUriTemplateMetaSelector.consumerGroupPidUriTemplate) consumerGroupPidUriTemplate$: Observable<any>;

  @Select(UserInfoState.getSelectedConsumerGroupId) consumerGroup$: Observable<string>;

  @Input() resourceType: string;

  @Input() previousVersion: string;
  @Input() isNew: boolean;

  private overlayRef: OverlayRef;

  pidUriConstant = Constants.Metadata.HasPidUri;
  metaData: MetaDataProperty[];
  linkingMetadata: MetaDataProperty[];
  resourceResult: Resource;
  pidUriTemplateNames: BehaviorSubject<Array<PidUriTemplateResultDTO>> = new BehaviorSubject(null);

  mainDistribution: string = null;

  activeResourceSubcription: Subscription;
  metadataSubcription: Subscription;
  activeMainDistributionSubcription: Subscription;
  pidUriFetchedSubscription: Subscription;
  consumerGroupPidUriTemplateSubcription: Subscription;

  placeholder: any = {};

  formErrors: ValidationResultProperty[];

  ontologyFormValues: any;

  constants = Constants;

  previousVersionCreated = false;

  constructor(
    private logger: LogService,
    private resourceService: ResourceApiService,
    private router: Router,
    private store: Store,
    private authService: AuthService,
    private snackBar: ColidMatSnackBarService,
    private resourceFormService: ResourceFormService,
    public dialog: MatDialog,
    private host: ElementRef,
    private dynamicOverlay: DynamicOverlay
  ) {
    super(store);
  }

  // convenience getter for easy access to form fields

  ngOnInit() {
    this.activeMainDistributionSubcription = this.activeMainDistribution$.subscribe(res => this.mainDistribution = res);
    this.overlayRef = this.dynamicOverlay.createWithDefaultConfig(
      this.host.nativeElement
    );
    //this.showOverlayLoader();

    this.setPlaceholder();
    if (this.resourceType) {
      this.placeholder[Constants.Metadata.EntityType] = this.resourceType;
    }

    this.setSelectedPidUriTemplateByTemplate(this.resourceFormService.DefaultPidUriTemplateKey);

    if (this.isNew && this.previousVersion == null) {
      this.store.dispatch(new SetActiveResource(new Resource())).subscribe(r => {
        this.activeResourceSubcription = this.activeResource$.subscribe(res => this.resourceResult = res);
      });
    } else {
      this.activeResourceSubcription = this.activeResource$.subscribe(
        res => {
          if (res) {
            this.resourceResult = this.preparePropertiesForMainDistributionEndpoint(res);

            if (this.previousVersion != null && !this.previousVersionCreated) {
              this.createNextVersionResource();
            } else {

              const pidUriConstants = this.resourceResult.properties[this.pidUriConstant];

              pidUriConstants.forEach((pidUriConstant: Entity) => {
                const pidUriTemplate = pidUriConstant.properties[Constants.Metadata.HasUriTemplate];

                if (pidUriTemplate) {
                  this.setSelectedPidUriTemplateByTemplate(pidUriTemplate[0]);
                }

              });
            }
          }
        }
      );
    }

    this.metadataSubcription = this.metaData$.subscribe(met => {
      if (met != null) {
        this.metaData = met.filter(m => m.key !== Constants.Metadata.MainDistribution);

        this.linkingMetadata = met.filter(m => {
          const group: MetaDataPropertyGroup = m.properties[Constants.Metadata.Group];
          if (group != null && group.key === Constants.Resource.Groups.LinkTypes) {
            return true;
          }
          return false;
        });

        this.hideOverlayLoader();
      }
    });



    this.consumerGroupPidUriTemplateSubcription = this.consumerGroupPidUriTemplate$.subscribe(cgput => {
      const templates = this.resourceFormService.extractAvailablePidUriTemplates(cgput.PidUriTemplates, cgput.ConsumerGroups, cgput.SelectedConsumerGroup);
      this.pidUriTemplateNames.next(templates);
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearActiveResource()).subscribe();
    this.store.dispatch(new ClearMetaData()).subscribe();
    if (this.activeResourceSubcription) {
      this.activeResourceSubcription.unsubscribe();
    }
    if (this.pidUriFetchedSubscription) {
      this.pidUriFetchedSubscription.unsubscribe();
    }

    if (this.consumerGroupPidUriTemplateSubcription) {
      this.consumerGroupPidUriTemplateSubcription.unsubscribe();
    }

    this.metadataSubcription.unsubscribe();
    this.activeMainDistributionSubcription.unsubscribe();
  }

  showOverlayLoader() {
    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(new ComponentPortal(LoaderComponent));
    }
  }

  hideOverlayLoader() {
    this.overlayRef.detach();
  }

  preparePropertiesForMainDistributionEndpoint(resource: Resource): Resource {
    if (resource == null) {
      return null;
    }

    const mainDistributionEndpoints = resource.properties[Constants.Metadata.MainDistribution];
    const distributionEndpoints = resource.properties[Constants.Metadata.Distribution];

    if (mainDistributionEndpoints && mainDistributionEndpoints.length) {
      resource.properties[Constants.Metadata.Distribution] = distributionEndpoints ? distributionEndpoints.concat(mainDistributionEndpoints) : mainDistributionEndpoints;
      delete resource.properties[Constants.Metadata.MainDistribution];
    }

    return resource;
  }

  createNextVersionResource() {
    this.resourceResult.id = '';

    let hasVersionProperty = this.resourceResult.properties[Constants.Metadata.HasVersion];

    if (hasVersionProperty) {
      const versionNumbers = hasVersionProperty[0].split('.');
      versionNumbers.push(+versionNumbers.pop() + 1);
      hasVersionProperty = versionNumbers.join('.');
      this.resourceResult.properties[Constants.Metadata.HasVersion] = [hasVersionProperty];
    }

    let newMainDistribution: string = null;



    this.resourceResult.properties[this.pidUriConstant] = this.resourceResult.properties[this.pidUriConstant].map((pidUriConstant: Entity) => {
      const pidUriTemplate = pidUriConstant.properties[Constants.Metadata.HasUriTemplate];
      const pidUriTemplatePreSelect = pidUriTemplate ? pidUriTemplate[0] : this.resourceFormService.DefaultPidUriTemplateKey;

      pidUriConstant.id = null;
      pidUriConstant.properties[Constants.Metadata.HasUriTemplate] = [pidUriTemplatePreSelect]

      this.setSelectedPidUriTemplateByTemplate(pidUriTemplatePreSelect);

      return pidUriConstant;
    });

    Object.keys(this.resourceResult.properties).forEach(key => {
      if (key === Constants.Metadata.Distribution || key === Constants.Metadata.MainDistribution) {
        // for each DE
        this.resourceResult.properties[key] = this.resourceResult.properties[key].map((endpoint: Entity) => {
          // New subejct for DE
          const newId = Constants.Resource.Prefix + Guid.create();
          if (endpoint.id === this.mainDistribution) {
            newMainDistribution = newId;
          }
          endpoint.id = newId;

          Object.keys(endpoint.properties).forEach(endpointPropertyKey => {
            if (endpointPropertyKey === this.pidUriConstant) {
              endpoint.properties[endpointPropertyKey] = endpoint.properties[endpointPropertyKey].map((endpointUri: Entity) => {

                const pidUriTemplate = endpointUri.properties[Constants.Metadata.HasUriTemplate];
                const pidUriTemplatePreSelect = pidUriTemplate ? pidUriTemplate : [this.resourceFormService.DefaultPidUriTemplateKey];

                endpointUri.id = null;
                endpointUri.properties[Constants.Metadata.HasUriTemplate] = pidUriTemplatePreSelect;

                return endpointUri;
              });
            }
          })

          return endpoint;
        });
      }
    });

    this.previousVersionCreated = true;
    this.store.dispatch(new SetActiveResource(this.resourceResult)).subscribe();
    this.store.dispatch(new SetMainDistribution(newMainDistribution)).subscribe();
  }

  setPlaceholder() {
    this.placeholder[Constants.Metadata.DateCreated] = new Date().toISOString();
    this.placeholder[Constants.Metadata.LastChangeDateTime] = new Date().toISOString();
    this.placeholder[Constants.Metadata.HasConsumerGroup] = this.resourceFormService.SelectedConsumerGroup;
    this.placeholder[Constants.Metadata.HasLastChangeUser] = this.authService.currentEmail;
    this.placeholder[Constants.Metadata.Author] = this.authService.currentEmail;
    this.placeholder[Constants.Metadata.EntityType] = null;
    this.placeholder[Constants.Metadata.HasVersion] = '1';
    this.placeholder[Constants.Metadata.LifeCycleStatus] = Constants.Resource.LifeCycleStatus.Draft;
  }

  handleServerResponse(error: HttpErrorResponse, isNew: boolean, operation: OPERATION, success: boolean) {
    if (error.error.type === "ResourceValidationException") {
      this.handleValidationResult(error.error, isNew, operation, success);
      return;
    }

    switch (error.status) {
      case 423:
        this.handleLockedException(error);
        break;
      default:
        this.hideOverlayLoader();
    }
  }

  handleValidationResult(resourceWriteResult: ResourceWriteResultCTO, isNew: boolean, operation: OPERATION, success: boolean) {
    const message = this.resourceFormService.createValidationMessage(success, resourceWriteResult.validationResult, operation);

    if (resourceWriteResult.validationResult.conforms || resourceWriteResult.validationResult.severity === ValidationResultSeverity.INFO) {
      this.store.dispatch(new FetchSidebarResourceOverview()).subscribe(res => res);

      this.store.dispatch(new SetResourceFormTouched(false)).subscribe();

      this.isNew = false;
      if (operation === OPERATION.SAVEANDPUBLISH) {
        if (!resourceWriteResult.validationResult.results.some(r => r.node !== Constants.Metadata.HasTargetUri && r.type !== ValidationResultPropertyType.DUPLICATE)) {
          this.publish(resourceWriteResult.resource.pidUri);
          return;
        }
      }

      this.hideOverlayLoader();

      if (operation === OPERATION.PUBLISH) {
        this.showAndLogMessage(message);
        this.router.navigate(['resource'], { queryParams: { pidUri: resourceWriteResult.resource.pidUri } });
        return;
      }

      if (operation === OPERATION.SAVE && resourceWriteResult.validationResult.conforms) {
        this.showAndLogMessage(message);
        this.router.navigate(['resource'], { queryParams: { pidUri: resourceWriteResult.resource.pidUri } });
        return;
      }
    } else {
      this.hideOverlayLoader();
    }

    this.store.dispatch(new SetActiveResource(resourceWriteResult.resource)).subscribe(() => {
      if (!resourceWriteResult.validationResult.conforms) {
        setTimeout(() => {
          if (operation === OPERATION.SAVEANDPUBLISH) {
            this.formErrors = resourceWriteResult.validationResult.results.map(r => {
              if (r.resultSeverity === ValidationResultSeverity.WARNING) {
                r.resultSeverity = ValidationResultSeverity.Violation;
              }
              return r;
            })
          } else {
            this.formErrors = resourceWriteResult.validationResult.results;
          }
        });
      }

      this.hideOverlayLoader();
      this.showAndLogMessage(message);
    });
  }

  handleLockedException(error: HttpErrorResponse) {
    this.snackBar.clear();
    this.hideOverlayLoader();
    const dialogRef = this.dialog.open(ResourceLockedDialogComponent, {
      width: 'auto', disableClose: true
    });
  }

  showAndLogMessage(message: any) {
    switch (message.level) {
      case 'error':
        this.snackBar.error(message.title, message.message);
        this.logger.error(message.message);
        break;
      case 'warn':
        this.snackBar.warning(message.title, message.message);
        this.logger.warn(message.message);
        break;
      case 'success':
        this.snackBar.success(message.title, message.message);
        this.logger.info(message.message);
    }
  }

  handleFormChanged(event: FormChangedDTO) {
    if (event.initialBuild) {
      console.log("Intital form build:", event);
      this.ontologyFormValues = event.formValue;
      return;
    }

    console.log("Form changed:", event);
    const id = event.id;
    this.ontologyFormValues = event.formValue;


    this.store.dispatch(new SetResourceFormTouched(true)).subscribe();

    if (id == null) {
      return;
    }

    if (id === Constants.Metadata.HasInformationClassification) {
      if (event.value === Constants.ControlledVocabulary.HasInformationClassification.Secret) {
        const dialogRef = this.dialog.open(ResourceFormSecretDialogComponent, {
          width: 'auto', disableClose: true
        });
      }
    }

    if (id === MetaDataPropertyIdentifier.pidUri && event.main) {
      this.setSelectedPidUriTemplateByEntity(event.value);
    }

    if (id.startsWith(MetaDataPropertyIdentifier.pidUri) || id.startsWith(MetaDataPropertyIdentifier.baseUri) || id.startsWith(MetaDataPropertyIdentifier.targetUri)) {
      const duplicateRequest = this.createDuplicateEntity();

      this.resourceService.checkDuplicate(duplicateRequest, this.previousVersion).subscribe((duplicateResult: ValidationResultProperty[]) => {
        this.formErrors = duplicateResult;
      });
    }
  }

  setSelectedPidUriTemplateByEntity(entity: Entity) {
    if (!entity) {
      this.setSelectedPidUriTemplateByTemplate(null);
    } else {
      const templates = entity[0].properties[Constants.Metadata.HasUriTemplate];

      if (templates) {
        templates.forEach((template: string) => {
          this.setSelectedPidUriTemplateByTemplate(template);
        });
      }

    }
  }

  setSelectedPidUriTemplateByTemplate(template: string) {
    if (template != null) {
      const entity = new Entity();
      entity.properties[Constants.Metadata.HasUriTemplate] = [template];
      this.placeholder[this.pidUriConstant] = [entity];
    } else {
      this.placeholder[this.pidUriConstant] = [new Entity()];
    }
  }

  get consumerGroupSelected(): boolean {
    const consumerGroup = this.ontologyFormValues[Constants.Metadata.HasConsumerGroup];

    if (consumerGroup !== null && consumerGroup.length !== 0) {
      return true;
    }

    this.snackBar.error('Error', 'No ConsumerGroup selected');
    return false;
  }

  save(operation: OPERATION) {
    if (operation == null) {
      operation = OPERATION.SAVE
    };

    if (!this.consumerGroupSelected) {
      return;
    }

    this.showOverlayLoader();
    const resource = this.createResourceRequestDto();
    this.snackBar.clear();

    if (this.isNew) {
      this.resourceService.createResource(resource).subscribe(
        (resourceResult: ResourceWriteResultCTO) => {
          this.store.dispatch(new FetchTaxonomyList(Constants.ResourceTypes.Keyword)).subscribe();
          this.handleValidationResult(resourceResult, true, operation, true);
        },
        (error: HttpErrorResponse) => {
          this.store.dispatch(new FetchTaxonomyList(Constants.ResourceTypes.Keyword)).subscribe();
          this.handleServerResponse(error, true, operation, false);
        });
    } else {
      this.resourceService.editResource(this.resourceResult.pidUri, resource).subscribe(
        (resourceResult: ResourceWriteResultCTO) => {
          this.store.dispatch(new FetchTaxonomyList(Constants.ResourceTypes.Keyword)).subscribe();
          this.handleValidationResult(resourceResult, false, operation, true);
        },
        (error: HttpErrorResponse) => {
          this.store.dispatch(new FetchTaxonomyList(Constants.ResourceTypes.Keyword)).subscribe();
          this.handleServerResponse(error, false, operation, false);
        });
    }
  }

  saveAndPublish() {
    this.save(OPERATION.SAVEANDPUBLISH);
  }

  publish(pidUri: string) {
    this.showOverlayLoader();
    this.snackBar.clear();

    if (this.isNew) {
      this.snackBar.error('Entry is new.', 'Before you can publish an entry, the entry must be saved and have no validation errors.');
      return;
    } else {
      this.resourceService.publishResource(pidUri).subscribe(
        (resourceResult: ResourceWriteResultCTO) => {
          this.handleValidationResult(resourceResult, false, OPERATION.PUBLISH, true);
          this.hideOverlayLoader();
        },
        (error: HttpErrorResponse) => {
          this.handleServerResponse(error, false, OPERATION.PUBLISH, false);
          this.hideOverlayLoader();
        });
    }
  }

  createDuplicateEntity(): Entity {
    const requestDto = this.createResourceRequestDto();
    const entity = new Entity();
    entity.properties = requestDto.properties;
    entity.id = this.resourceResult.id;

    return entity;
  }

  createResourceRequestDto(): ResourceRequestDTO {
    const formProperties = Object.entries(this.ontologyFormValues);
    const resourceDto = this.resourceFormService.createResourceDto(formProperties, this.metaData, this.mainDistribution);
    resourceDto.hasPreviousVersion = this.previousVersion;

    return resourceDto;
  }

  revert() {
    this.showOverlayLoader();

    this.store.dispatch(new FetchPublishedResourceWithMetaData(this.resourceResult.pidUri))
      .subscribe(() => {
        this.hideOverlayLoader();
      });
  }

  get hasPublishedVersion(): boolean {
    return ResourceExtension.hasPublishedVersion(this.resourceResult);
  }
}
