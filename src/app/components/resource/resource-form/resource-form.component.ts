import { Select, Store } from "@ngxs/store";
import {
  ResourceState,
  SetActiveResource,
  ClearActiveResource,
  SetMainDistribution,
  FetchPublishedResourceWithMetaData,
} from "../../../state/resource.state";
import { OnInit, Input, Component, OnDestroy, ElementRef } from "@angular/core";
import { Observable, Subscription, BehaviorSubject, combineLatest } from "rxjs";
import { MetaDataProperty } from "../../../shared/models/metadata/meta-data-property";
import {
  MetaDataState,
  ClearMetaData,
  ClearActiveSecondMetaData,
} from "../../../state/meta-data.state";
import { LogService } from "../../../core/logging/log.service";
import { ResourceApiService } from "../../../core/http/resource.api.service";
import { Router } from "@angular/router";
import { ResourceFormService, OPERATION } from "./resource-form.service";
import { MetaDataPropertyIdentifier } from "./resource-form.constants";
import { HttpErrorResponse } from "@angular/common/http";
import { ResourceWriteResultCTO } from "src/app/shared/models/resources/resource-write-result-cto";
import { ResourceRequestDTO } from "src/app/shared/models/resources/requests/resource-request-dto";
import { Constants } from "src/app/shared/constants";
import { ConsumerGroupPidUriTemplateMetaSelector } from "src/app/state/consumer-group.state";
import { PidUriTemplateState } from "src/app/state/pid-uri-template.state";
import { UserInfoState } from "src/app/state/user-info.state";
import { Entity } from "src/app/shared/models/Entities/entity";
import {
  ValidationResultProperty,
  ValidationResultPropertyType,
} from "src/app/shared/models/validation/validation-result-property";
import { FormChangedDTO } from "src/app/shared/models/form/form-changed-dto";
import { Guid } from "guid-typescript";
import { Resource } from "../../../shared/models/resources/resource";
import { PidUriTemplateResultDTO } from "src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto";
import {
  MatDialog,
  MatDialogRef,
  MatDialogState,
} from "@angular/material/dialog";
import { ResourceFormSecretDialogComponent } from "./resource-form-secret-dialog/resource-form-secret-dialog.component";
import { SetResourceFormTouched } from "src/app/state/resource-form.state";
import { MetaDataPropertyGroup } from "src/app/shared/models/metadata/meta-data-property-group";
import { ResourceExtension } from "src/app/shared/extensions/resource.extension";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { FetchSidebarResourceOverview } from "src/app/state/resource-overview.state";
import { OverlayRef } from "@angular/cdk/overlay";
import { DynamicOverlay } from "src/app/shared/services/overlay/dynamic-overlay";
import { FetchTaxonomyList } from "src/app/state/taxonomy.state";
import { ResourceLockedDialogComponent } from "../resource-dialogs/resource-locked-dialog/resource-locked-dialog.component";
import { ComponentCanDeactivate } from "src/app/core/guards/can-deactivate/can-deactivate.component";
import { AuthService } from "src/app/modules/authentication/services/auth.service";
import { ValidationResultSeverity } from "src/app/shared/models/validation/validation-result-severity";
import { ResourceCreationType } from "src/app/shared/models/resources/resource-creation-type";
import { Location } from "@angular/common";
import { EntityFormStatus } from "src/app/shared/components/entity-form/entity-form-status";
import { StringExtension } from "src/app/shared/extensions/string.extension";
import {
  ResourceFormIncompatibleLinksDialogComponent,
  LinkData,
} from "./resource-form-incompatible-links-dialog/resource-form-incompatible-links-dialog.component";
import { ResourceSearchDTO } from "src/app/shared/models/search/resource-search-dto";
@Component({
  selector: "app-resource-form",
  templateUrl: "./resource-form.component.html",
  styleUrls: ["./resource-form.component.css"],
})
export class ResourceFormComponent
  extends ComponentCanDeactivate
  implements OnInit, OnDestroy
{
  @Select(ResourceState.activeResource) activeResource$: Observable<Resource>;
  @Select(ResourceState.getActiveMainDistribution)
  activeMainDistribution$: Observable<string>;

  @Select(MetaDataState.actualMetadata) metaData$: Observable<
    MetaDataProperty[]
  >;
  @Select(MetaDataState.actualSecondMetadata) secondMetaData$: Observable<
    MetaDataProperty[]
  >;
  @Select(PidUriTemplateState.getPidUriTemplatesFetched)
  pidUriTemplatesFetched$: Observable<boolean>;
  @Select(ConsumerGroupPidUriTemplateMetaSelector.consumerGroupPidUriTemplate)
  consumerGroupPidUriTemplate$: Observable<any>;

  @Select(UserInfoState.getSelectedConsumerGroupId)
  consumerGroup$: Observable<string>;

  @Input() resourceType: string;
  @Input() basedResourceUri: string;
  @Input() creationType: ResourceCreationType = ResourceCreationType.NEW;

  @Input() isNew: boolean;

  private overlayRef: OverlayRef;

  pidUriConstant = Constants.Metadata.HasPidUri;
  metaData: MetaDataProperty[];
  secondMetaData: MetaDataProperty[];
  linkingMetadata: MetaDataProperty[];
  secondLinkingMetadata: MetaDataProperty[];
  latestNonEmptyLinkingMetadata: MetaDataProperty[];
  resourceResult: Resource;
  pidUriTemplateNames: BehaviorSubject<Array<PidUriTemplateResultDTO>> =
    new BehaviorSubject(null);

  mainDistribution: string = null;

  activeResourceSubcription: Subscription;
  metadataSubcription: Subscription;
  secondMetadataSubcription: Subscription;
  activeMainDistributionSubcription: Subscription;
  pidUriFetchedSubscription: Subscription;
  consumerGroupPidUriTemplateSubcription: Subscription;

  placeholder: any = {};

  formErrors: ValidationResultProperty[];

  ontologyFormValues: any;

  constants = Constants;

  resourceCreated = false;

  email: string;

  isResourceChanging = false;

  identifierElementsCount: number;
  identifierElementsInitialized = 0;

  private dialogRef: MatDialogRef<
    ResourceFormIncompatibleLinksDialogComponent,
    any
  > = null;

  status: EntityFormStatus = EntityFormStatus.INITIAL;
  currentOperation: OPERATION;
  operation = OPERATION;
  badCharacters = [
    "À",
    "Á",
    "Â",
    "Ã",
    "Ä",
    "Å",
    "È",
    "É",
    "Ê",
    "Ë",
    "Ì",
    "Í",
    "Î",
    "Ò",
    "Ó",
    "Ô",
    "Õ",
    "Ù",
    "Ú",
    "Û",
    "å",
    "à",
    "á",
    "â",
    "ã",
    "å",
    "å",
    "è",
    "é",
    "ë",
    "ê",
    "ì",
    "í",
    "î",
    "ò",
    "ó",
    "ô",
    "õ",
    "ø",
    "ù",
    "ú",
    "û",
    "Ç",
    "Ð",
    "Ñ",
    "Ý",
    "ç",
    "ñ",
    "ý",
  ];

  get isLoading(): boolean {
    return this.status === EntityFormStatus.LOADING;
  }

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
    private dynamicOverlay: DynamicOverlay,
    private location: Location
  ) {
    super(store);
    this.setPlaceholder();
  }

  // convenience getter for easy access to form fields

  ngOnInit() {
    this.activeMainDistributionSubcription =
      this.activeMainDistribution$.subscribe(
        (res) => (this.mainDistribution = res)
      );
    this.overlayRef = this.dynamicOverlay.createWithDefaultConfig(
      this.host.nativeElement
    );

    this.authService.currentEmail$.subscribe((email) => {
      this.email = email;
    });

    this.setPlaceholder();
    if (this.resourceType) {
      this.placeholder[Constants.Metadata.EntityType] = this.resourceType;
    }
    this.setSelectedPidUriTemplateByTemplate(
      this.resourceFormService.DefaultPidUriTemplateKey
    );

    if (this.isNew && this.creationType === ResourceCreationType.NEW) {
      this.store
        .dispatch(new SetActiveResource(new Resource()))
        .subscribe((_) => {
          this.activeResourceSubcription = this.activeResource$.subscribe(
            (res) => (this.resourceResult = res)
          );
        });
    } else {
      this.activeResourceSubcription = this.activeResource$.subscribe((res) => {
        if (res) {
          this.resourceResult =
            this.preparePropertiesForMainDistributionEndpoint(res);
          this.identifierElementsInitialized = 0;

          this.identifierElementsCount = !!this.resourceResult.properties
            ? Object.entries(this.resourceResult.properties)
                .map((entry) => entry[0])
                .filter((uri) => this.isUriProperty(uri)).length +
              (!!this.resourceResult.properties[
                this.constants.Metadata.Distribution
              ]
                ? Object.entries(
                    this.resourceResult.properties[
                      this.constants.Metadata.Distribution
                    ]
                  ).length
                : 0)
            : 0;

          // for the dialog
          this.updateLinkWarning(
            this.resourceResult,
            this.latestNonEmptyLinkingMetadata,
            this.secondLinkingMetadata
          );
          if (this.basedResourceUri != null && !this.resourceCreated) {
            this.modifyResourceForBasedCreation();

            if (this.creationType === ResourceCreationType.COPY) {
              this.modifyResourceToCopying();
            }
            if (this.creationType === ResourceCreationType.NEWVERSION) {
              this.modifyResourecForNextVersion();
            }
          } else {
            const pidUriConstants =
              this.resourceResult.properties[this.pidUriConstant];

            pidUriConstants.forEach((pidUriConstant: Entity) => {
              const pidUriTemplate =
                pidUriConstant.properties[Constants.Metadata.HasUriTemplate];

              if (pidUriTemplate) {
                this.setSelectedPidUriTemplateByTemplate(pidUriTemplate[0]);
              }
            });
          }
        }
      });
    }

    this.metadataSubcription = this.metaData$.subscribe((met) => {
      if (met != null) {
        this.identifierElementsInitialized = 0;
        this.metaData = met.filter(
          (m) => m.key !== Constants.Metadata.MainDistribution
        );

        this.linkingMetadata = met.filter((m) => {
          const group: MetaDataPropertyGroup =
            m.properties[Constants.Metadata.Group];
          if (
            group != null &&
            group.key === Constants.Resource.Groups.LinkTypes
          ) {
            return true;
          }
          return false;
        });

        if (!!this.linkingMetadata && this.linkingMetadata.length > 0)
          this.latestNonEmptyLinkingMetadata = this.linkingMetadata;

        if (!!this.linkingMetadata && this.linkingMetadata.length > 0)
          this.updateLinkWarning(
            this.resourceResult,
            this.latestNonEmptyLinkingMetadata,
            this.secondLinkingMetadata
          );

        if (!!this.secondMetaData) {
          this.metaData = this.overrideMetadata(
            this.metaData,
            this.secondMetaData
          );
          this.linkingMetadata = this.overrideMetadata(
            this.linkingMetadata,
            this.secondLinkingMetadata
          );
        }
      }
    });

    this.secondMetadataSubcription = this.secondMetaData$.subscribe((met) => {
      if (met != null) {
        this.identifierElementsInitialized = 0;
        this.isResourceChanging = true;

        this.secondMetaData = met.filter(
          (m) => m.key !== Constants.Metadata.MainDistribution
        );

        this.secondLinkingMetadata = met.filter((m) => {
          const group: MetaDataPropertyGroup =
            m.properties[Constants.Metadata.Group];
          if (
            group != null &&
            group.key === Constants.Resource.Groups.LinkTypes
          ) {
            return true;
          }
          return false;
        });

        this.updateLinkWarning(
          this.resourceResult,
          this.latestNonEmptyLinkingMetadata,
          this.secondLinkingMetadata
        );

        if (!!this.metaData) {
          this.metaData = this.overrideMetadata(
            this.metaData,
            this.secondMetaData
          );
          this.linkingMetadata = this.overrideMetadata(
            this.linkingMetadata,
            this.secondLinkingMetadata
          );
        }
      }
    });

    this.consumerGroupPidUriTemplateSubcription =
      this.consumerGroupPidUriTemplate$.subscribe((cgput) => {
        const templates =
          this.resourceFormService.extractAvailablePidUriTemplates(
            cgput.PidUriTemplates,
            cgput.ConsumerGroups,
            cgput.SelectedConsumerGroup
          );
        this.pidUriTemplateNames.next(templates);
      });
  }

  private updateLinkWarning(
    resource: Resource,
    linkingMetadata: MetaDataProperty[],
    secondLinkingMetadata: MetaDataProperty[]
  ) {
    if (
      !!resource &&
      !!linkingMetadata &&
      linkingMetadata.length > 0 &&
      !!secondLinkingMetadata &&
      secondLinkingMetadata.length > 0
    ) {
      const linkData: LinkData[] = Object.entries(resource.links)
        .map((entry) =>
          entry[1].map((link) => ({
            sourceURI: resource.pidUri,
            targetURI: link.pidUri,
            type: entry[0],
          }))
        )
        .reduce((prev, cur) => prev.concat(cur), []);
      const secondMetaKeySet = new Set(
        secondLinkingMetadata.map((met) => met.key)
      );
      const firstDifMetaKeySet = new Set(
        linkingMetadata
          .map((met) => met.key)
          .filter((key) => !secondMetaKeySet.has(key))
      );

      const prettyLinkTypeNames: Map<string, string> = new Map(
        linkingMetadata.map((met) => [
          met.key,
          met.properties[this.constants.Metadata.Name],
        ])
      );
      const targetLinkData = linkData
        .filter((ldata) => firstDifMetaKeySet.has(ldata.type))
        .map((ldata) => ({
          sourceURI: ldata.sourceURI,
          targetURI: ldata.targetURI,
          type: prettyLinkTypeNames.get(ldata.type),
          targetLabel: "",
          targetDefinition: "",
        }));

      if (targetLinkData.length > 0) {
        const resourceSearch = new ResourceSearchDTO();

        resourceSearch.pidUris = targetLinkData.map((ldata) => ldata.targetURI);
        resourceSearch.limit = resourceSearch.pidUris.length * 4; // 4 = #{draft, published, historic, markedForDel}, getFilteredResources can have issues in some rare cases
        resourceSearch.published = true;

        this.resourceService
          .getFilteredResources(resourceSearch)
          .subscribe((res) => {
            const uriLabelsMap: Map<string, [string, string]> = new Map(
              res.items
                .filter(
                  (link) =>
                    link.lifeCycleStatus ==
                    Constants.Resource.LifeCycleStatus.Published
                )
                .map((link) => [link.pidUri, [link.name, link.definition]])
            );
            targetLinkData.forEach((ldata) => {
              ldata.targetLabel = uriLabelsMap.get(ldata.targetURI)[0];
              ldata.targetDefinition = uriLabelsMap.get(ldata.targetURI)[1];
            });
            this.startLinkWarningDialog(targetLinkData);
          });
      }
    }
  }

  private startLinkWarningDialog(linkDataArray: LinkData[]) {
    if (
      this.dialogRef != null &&
      this.dialogRef.getState() == MatDialogState.OPEN
    ) {
      this.dialogRef.componentInstance.data.linkData = linkDataArray;
    } else {
      this.dialogRef = this.dialog.open(
        ResourceFormIncompatibleLinksDialogComponent,
        {
          width: "750px",
          height: "520px",
          disableClose: true,
          data: { linkData: linkDataArray },
        }
      );
    }
  }

  overrideMetadata(
    firstMetadata: MetaDataProperty[],
    secondMetadata: MetaDataProperty[]
  ) {
    const metaKeySet = new Set(secondMetadata.map((met) => met.key));
    const commonMeta = firstMetadata.filter(
      (met) =>
        metaKeySet.has(met.key) && met.key != Constants.Metadata.EntityType
    );
    const commonKeySet = new Set(commonMeta.map((met) => met.key));

    return commonMeta.concat(
      secondMetadata.filter((met) => !commonKeySet.has(met.key))
    );
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearActiveResource()).subscribe();
    this.store.dispatch(new ClearMetaData()).subscribe();
    this.store.dispatch(new ClearActiveSecondMetaData());
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
    this.secondMetadataSubcription.unsubscribe();
    this.activeMainDistributionSubcription.unsubscribe();
  }

  hideOverlayLoader() {
    this.overlayRef.detach();
  }

  preparePropertiesForMainDistributionEndpoint(resource: Resource): Resource {
    if (resource == null) {
      return null;
    }

    const mainDistributionEndpoints =
      resource.properties[Constants.Metadata.MainDistribution];
    const distributionEndpoints =
      resource.properties[Constants.Metadata.Distribution];

    if (mainDistributionEndpoints && mainDistributionEndpoints.length) {
      resource.properties[Constants.Metadata.Distribution] =
        distributionEndpoints
          ? distributionEndpoints.concat(mainDistributionEndpoints)
          : mainDistributionEndpoints;
      delete resource.properties[Constants.Metadata.MainDistribution];
    }

    return resource;
  }

  modifyResourecForNextVersion() {
    let hasVersionProperty =
      this.resourceResult.properties[Constants.Metadata.HasVersion];

    if (hasVersionProperty) {
      const versionNumbers = hasVersionProperty[0].split(".");
      versionNumbers.push(+versionNumbers.pop() + 1);
      hasVersionProperty = versionNumbers.join(".");
      this.resourceResult.properties[Constants.Metadata.HasVersion] = [
        hasVersionProperty,
      ];
    }
  }

  modifyResourceToCopying() {
    this.clearIdentiferByKey(Constants.Metadata.HasBaseUri);
  }

  modifyResourceForBasedCreation() {
    this.resourceResult.id = "";

    this.clearIdentiferByKey(Constants.Metadata.HasPidUri);

    let newMainDistribution: string = null;
    Object.keys(this.resourceResult.properties).forEach((key) => {
      if (key === Constants.Metadata.EntityType && this.resourceType != null) {
        this.resourceResult.properties[key] = [this.resourceType];
      }

      if (
        key === Constants.Metadata.Distribution ||
        key === Constants.Metadata.MainDistribution
      ) {
        // for each DE
        this.resourceResult.properties[key] = this.resourceResult.properties[
          key
        ].map((endpoint: Entity) => {
          // New subejct for DE
          const newId = Constants.Resource.Prefix + Guid.create();
          if (endpoint.id === this.mainDistribution) {
            newMainDistribution = newId;
          }
          endpoint.id = newId;

          Object.keys(endpoint.properties).forEach((endpointPropertyKey) => {
            if (endpointPropertyKey === this.pidUriConstant) {
              endpoint.properties[endpointPropertyKey] = endpoint.properties[
                endpointPropertyKey
              ].map((endpointUri: Entity) => {
                const pidUriTemplate =
                  endpointUri.properties[Constants.Metadata.HasUriTemplate];
                const pidUriTemplatePreSelect = pidUriTemplate
                  ? pidUriTemplate
                  : [this.resourceFormService.DefaultPidUriTemplateKey];

                endpointUri.id = null;
                endpointUri.properties[Constants.Metadata.HasUriTemplate] =
                  pidUriTemplatePreSelect;

                return endpointUri;
              });
            }
          });

          return endpoint;
        });
      }
    });

    this.store.dispatch(new SetActiveResource(this.resourceResult)).subscribe();
    this.store
      .dispatch(new SetMainDistribution(newMainDistribution))
      .subscribe();
  }

  clearIdentiferByKey(identifierKey: string) {
    this.resourceResult.properties[identifierKey] =
      this.resourceResult.properties[identifierKey].map(
        (identifier: Entity) => {
          const pidUriTemplate =
            identifier.properties[Constants.Metadata.HasUriTemplate];
          const pidUriTemplatePreSelect = pidUriTemplate
            ? pidUriTemplate[0]
            : this.resourceFormService.DefaultPidUriTemplateKey;

          identifier.id = null;
          identifier.properties[Constants.Metadata.HasUriTemplate] = [
            pidUriTemplatePreSelect,
          ];

          this.setSelectedPidUriTemplateByTemplate(pidUriTemplatePreSelect);

          return identifier;
        }
      );
  }

  setPlaceholder() {
    this.placeholder[Constants.Metadata.DateCreated] = new Date().toISOString();
    this.placeholder[Constants.Metadata.LastChangeDateTime] =
      new Date().toISOString();
    this.placeholder[Constants.Metadata.HasConsumerGroup] =
      this.resourceFormService.SelectedConsumerGroup;
    this.placeholder[Constants.Metadata.HasResourceReviewCyclePolicy] =
      this.resourceFormService.SelectedConsumerGroupDefaultReviewCyclePolicy;
    this.placeholder[Constants.Metadata.EntityType] = null;
    this.placeholder[Constants.Metadata.HasVersion] = "1";
    this.placeholder[Constants.Metadata.LifeCycleStatus] =
      Constants.Resource.LifeCycleStatus.Draft;
    this.placeholder[Constants.Metadata.HasLastChangeUser] = this.email;
    this.placeholder[Constants.Metadata.Author] = this.email;
  }

  handleServerResponse(
    error: HttpErrorResponse,
    operation: OPERATION,
    success: boolean
  ) {
    if (error.error.type === "ResourceValidationException") {
      this.handleValidationResult(error.error, operation, success);
      return;
    }

    switch (error.status) {
      case 423:
        this.handleLockedException(error);
        break;
      default:
        this.status = EntityFormStatus.ERROR;
    }
  }

  handleValidationResult(
    resourceWriteResult: ResourceWriteResultCTO,
    operation: OPERATION,
    success: boolean
  ) {
    this.resourceCreated = true;
    const message = this.resourceFormService.createValidationMessage(
      success,
      resourceWriteResult.validationResult,
      operation
    );

    if (
      resourceWriteResult.validationResult.severity !==
      ValidationResultSeverity.Violation
    ) {
      this.status = EntityFormStatus.SUCCESS;
      const url = this.router
        .createUrlTree(["resource", "edit"], {
          queryParams: { pidUri: resourceWriteResult.resource.pidUri },
        })
        .toString();
      this.location.go(url);

      this.isNew = false;
    }

    if (
      resourceWriteResult.validationResult.conforms ||
      resourceWriteResult.validationResult.severity ===
        ValidationResultSeverity.INFO
    ) {
      this.store
        .dispatch(new FetchSidebarResourceOverview(true))
        .subscribe((res) => res);
      this.store.dispatch(new SetResourceFormTouched(false)).subscribe();

      if (operation === OPERATION.SAVEANDPUBLISH) {
        if (
          !resourceWriteResult.validationResult.results.some(
            (r) =>
              r.node !== Constants.Metadata.HasTargetUri &&
              r.type !== ValidationResultPropertyType.DUPLICATE
          )
        ) {
          this.publish(resourceWriteResult.resource.pidUri, operation);
          return;
        }
      }

      this.status = EntityFormStatus.ERROR;

      if (operation === OPERATION.PUBLISH) {
        this.showAndLogMessage(message);
        this.router.navigate(["resource"], {
          queryParams: { pidUri: resourceWriteResult.resource.pidUri },
        });
        return;
      }

      if (
        operation === OPERATION.SAVE &&
        resourceWriteResult.validationResult.conforms
      ) {
        this.showAndLogMessage(message);
        this.router.navigate(["resource"], {
          queryParams: { pidUri: resourceWriteResult.resource.pidUri },
        });
        return;
      }
    } else {
      this.status = EntityFormStatus.ERROR;
    }

    this.store
      .dispatch(new SetActiveResource(resourceWriteResult.resource))
      .subscribe(() => {
        if (!resourceWriteResult.validationResult.conforms) {
          setTimeout(() => {
            if (operation === OPERATION.SAVEANDPUBLISH) {
              this.formErrors =
                resourceWriteResult.validationResult.results.map((r) => {
                  if (r.resultSeverity === ValidationResultSeverity.WARNING) {
                    r.resultSeverity = ValidationResultSeverity.Violation;
                  }
                  return r;
                });
            } else {
              this.formErrors = resourceWriteResult.validationResult.results;
            }
          });
        }

        this.status = EntityFormStatus.ERROR;
        this.showAndLogMessage(message);
      });
  }

  handleLockedException(_: HttpErrorResponse) {
    this.snackBar.clear();
    this.status = EntityFormStatus.ERROR;

    this.dialog.open(ResourceLockedDialogComponent, {
      width: "auto",
      disableClose: true,
    });
  }

  showAndLogMessage(message: any) {
    switch (message.level) {
      case "error":
        this.snackBar.error(message.title, message.message);
        this.logger.error(message.message);
        break;
      case "warn":
        this.snackBar.warning(message.title, message.message);
        this.logger.warn(message.message);
        break;
      case "success":
        this.snackBar.success(message.title, message.message);
        this.logger.info(message.message);
    }
  }

  containsSubstring(target, pattern) {
    if (target == undefined || target == null) {
      return false;
    }
    var value = 0;
    pattern.forEach(function (word) {
      value = value + target.includes(word);
    });
    return value > 0;
  }

  badCaharcterInLable() {
    return this.containsSubstring(
      this.ontologyFormValues[Constants.Metadata.HasLabel] as string,
      this.badCharacters
    );
  }
  badCaharcterInDef() {
    return this.containsSubstring(
      this.ontologyFormValues[
        Constants.Metadata.HasResourceDefinition
      ] as string,
      this.badCharacters
    );
  }

  handleFormChanged(event: FormChangedDTO) {
    if (event.initialBuild) {
      this.ontologyFormValues = event.formValue;
      return;
    }

    const id = event.id;
    this.ontologyFormValues = event.formValue;

    this.store.dispatch(new SetResourceFormTouched(true)).subscribe();

    if (id == null) {
      return;
    }

    if (id === Constants.Metadata.HasInformationClassification) {
      if (
        event.value ===
        Constants.ControlledVocabulary.HasInformationClassification.Secret
      ) {
        this.dialog.open(ResourceFormSecretDialogComponent, {
          width: "auto",
          disableClose: true,
        });
      }
    }

    if (
      id === Constants.Metadata.HasLabel ||
      id === Constants.Metadata.HasResourceDefinition
    ) {
      if (this.badCaharcterInLable() || this.badCaharcterInDef()) {
        this.snackBar.warning(
          "Found unallowed characters in label or definition!",
          "The following characters are not allowed and will be deleted while creating the resource: À,Á,Â,Ã,Ä,Å,È,É,Ê,Ë,Ì,Í,Î,Ò,Ó,Ô,Õ,Ù,Ú,Û,å,à,á,â,ã,å,å,è,é,ë,ê,ì,í,î,ò,ó,ô,õ,ø,ù,ú,û,Ç,Ð,Ñ,Ý,ç,ñ,ý"
        );
      }
    }

    if (id === MetaDataPropertyIdentifier.pidUri && event.main) {
      this.setSelectedPidUriTemplateByEntity(event.value);
    }

    if (this.isUriProperty(id)) {
      if (event.created) {
        this.identifierElementsInitialized++;
      }

      if (
        !event.created ||
        this.identifierElementsInitialized >= this.identifierElementsCount
      ) {
        const duplicateRequest = this.createDuplicateEntity();
        const previousVersion =
          this.creationType === ResourceCreationType.NEWVERSION
            ? this.basedResourceUri
            : null;

        combineLatest([
          this.resourceService.checkDuplicate(
            duplicateRequest,
            previousVersion
          ),
          this.secondMetaData$,
        ]).subscribe((val) => {
          const duplicateResult: ValidationResultProperty[] = val[0];
          if (val[1] == null) this.formErrors = duplicateResult;
        });
      }
    }
  }

  private isUriProperty(property: string): boolean {
    return (
      property.startsWith(MetaDataPropertyIdentifier.pidUri) ||
      property.startsWith(MetaDataPropertyIdentifier.baseUri) ||
      property.startsWith(MetaDataPropertyIdentifier.targetUri)
    );
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
    const consumerGroup =
      this.ontologyFormValues[Constants.Metadata.HasConsumerGroup];

    if (consumerGroup !== null && consumerGroup.length !== 0) {
      return true;
    }

    this.snackBar.error("Error", "No ConsumerGroup selected");
    return false;
  }

  save(operation: OPERATION) {
    if (operation == null) {
      operation = OPERATION.SAVE;
    }

    if (
      this.ontologyFormValues[Constants.Metadata.HasLabel] != null &&
      this.ontologyFormValues[Constants.Metadata.HasLabel] != "" &&
      this.badCaharcterInLable()
    ) {
      var label = StringExtension.ReplaceHtmlToText(
        this.ontologyFormValues[Constants.Metadata.HasLabel]
      );
      this.ontologyFormValues[Constants.Metadata.HasLabel] = label;
    }

    if (
      this.ontologyFormValues[Constants.Metadata.HasResourceDefinition] !=
        null &&
      this.ontologyFormValues[Constants.Metadata.HasResourceDefinition][0] !=
        "" &&
      this.badCaharcterInDef()
    ) {
      var def = StringExtension.ReplaceHtmlToText(
        this.ontologyFormValues[
          Constants.Metadata.HasResourceDefinition
        ] as string
      );
      this.ontologyFormValues[Constants.Metadata.HasResourceDefinition] = def;
    }

    this.currentOperation = operation;

    if (!this.consumerGroupSelected) {
      return;
    }

    this.status = EntityFormStatus.LOADING;
    const resource = this.createResourceRequestDto();

    this.snackBar.clear();
    if (this.isNew) {
      this.resourceService.createResource(resource).subscribe(
        (resourceResult: ResourceWriteResultCTO) => {
          this.fetchTaxonomy();
          this.handleValidationResult(resourceResult, operation, true);
        },
        (error: HttpErrorResponse) => {
          this.fetchTaxonomy();
          this.handleServerResponse(error, operation, false);
        }
      );
    } else {
      (!this.secondMetaData
        ? this.resourceService.editResource(
            this.resourceResult.pidUri,
            resource
          )
        : this.resourceService.editResourceType(
            this.resourceResult.pidUri,
            resource
          )
      ).subscribe(
        (resourceResult: ResourceWriteResultCTO) => {
          this.fetchTaxonomy();
          this.handleValidationResult(resourceResult, operation, true);
        },
        (error: HttpErrorResponse) => {
          this.fetchTaxonomy();
          this.handleServerResponse(error, operation, false);
        }
      );
    }
  }

  saveAndPublish() {
    this.save(OPERATION.SAVEANDPUBLISH);
  }

  fetchTaxonomy() {
    this.metaData.forEach((m) => {
      const range = m.properties[Constants.Metadata.Range];
      const fieldType = m.properties[Constants.Metadata.FieldType];

      if (
        range != null &&
        fieldType === Constants.Metadata.FieldTypes.ExtandableList
      ) {
        this.store.dispatch(new FetchTaxonomyList(range, true)).subscribe();
      }
    });
  }

  publish(pidUri: string, operation: OPERATION = OPERATION.PUBLISH) {
    this.currentOperation = operation;
    this.snackBar.clear();

    if (this.isNew) {
      this.snackBar.error(
        "Entry is new.",
        "Before you can publish an entry, the entry must be saved and have no validation errors."
      );
      return;
    } else {
      this.status = EntityFormStatus.LOADING;
      this.resourceService.publishResource(pidUri).subscribe(
        (resourceResult: ResourceWriteResultCTO) => {
          this.handleValidationResult(resourceResult, OPERATION.PUBLISH, true);
          this.status = EntityFormStatus.SUCCESS;
        },
        (error: HttpErrorResponse) => {
          this.handleServerResponse(error, OPERATION.PUBLISH, false);
          this.status = EntityFormStatus.ERROR;
        }
      );
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
    const resourceDto = this.resourceFormService.createResourceDto(
      formProperties,
      this.metaData,
      this.mainDistribution
    );
    resourceDto.hasPreviousVersion =
      this.creationType === ResourceCreationType.NEWVERSION
        ? this.basedResourceUri
        : null;
    return resourceDto;
  }

  revert() {
    this.currentOperation = OPERATION.REVERT;
    this.status = EntityFormStatus.LOADING;

    this.store
      .dispatch(
        new FetchPublishedResourceWithMetaData(this.resourceResult.pidUri)
      )
      .subscribe(
        () => {
          this.status = EntityFormStatus.SUCCESS;
        },
        (_) => {
          this.status = EntityFormStatus.ERROR;
        }
      );
  }

  get hasPublishedVersion(): boolean {
    return ResourceExtension.hasPublishedVersion(this.resourceResult);
  }
}
