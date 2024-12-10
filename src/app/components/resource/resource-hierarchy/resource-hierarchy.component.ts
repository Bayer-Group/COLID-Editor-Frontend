import { Component, OnInit, OnDestroy, Optional } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { MetaDataState, FetchHierarchy } from 'src/app/state/meta-data.state';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityTypeDto } from 'src/app/shared/models/Entities/entity-type-dto';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ResourceCreationType } from 'src/app/shared/models/resources/resource-creation-type';
import { MatDialogRef } from '@angular/material/dialog';
import { UserInfoState } from 'src/app/state/user-info.state';
import {
  FetchResourceTemplates,
  ResourceTemplateState
} from 'src/app/state/resource-template.state';
import { ResourceTemplateResultDTO } from 'src/app/shared/models/resource-templates/resource-template-result-dto';
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-resource-hierarchy',
  templateUrl: './resource-hierarchy.component.html',
  styleUrls: ['./resource-hierarchy.component.scss']
})
export class ResourceHierarchyComponent implements OnInit, OnDestroy {
  @Select(MetaDataState.hierarchy) resourceTypes$: Observable<EntityTypeDto>;
  @Select(UserInfoState.getSelectedConsumerGroupTemplateIds)
  consumerGroupResourceTemplateIds$: Observable<string[]>;
  @Select(ResourceTemplateState.getResourceTemplates)
  resourceTemplates$: Observable<ResourceTemplateResultDTO[]>;

  treeControl = new NestedTreeControl<EntityTypeDto>((node) => node.subClasses);
  dataSource = new MatTreeNestedDataSource<EntityTypeDto>();

  hasChild = (_: number, node: EntityTypeDto) =>
    !!node.subClasses && node.subClasses.length > 0;

  resourceHierarchy: EntityTypeDto;
  activeItem: EntityTypeDto;
  defaultItem: string;
  resourceTypesSubscription: Subscription;
  creationType: ResourceCreationType = ResourceCreationType.NEW;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    @Optional() public dialogRef: MatDialogRef<ResourceHierarchyComponent>
  ) {
    this.dataSource.data = [];
  }

  get isNewCreationType(): boolean {
    return this.creationType === ResourceCreationType.NEW;
  }

  ngOnInit() {
    this.store.dispatch([new FetchHierarchy(), new FetchResourceTemplates()]);

    const queryParamMap = this.route.snapshot.queryParamMap;

    if (queryParamMap?.has('type')) {
      this.defaultItem = queryParamMap.get('type');
    }
    if (queryParamMap?.has('creationType')) {
      this.creationType = <ResourceCreationType>(
        this.route.snapshot.queryParamMap.get('creationType')
      );
    }

    this.resourceTypesSubscription = combineLatest([
      this.resourceTypes$,
      this.consumerGroupResourceTemplateIds$,
      this.resourceTemplates$
    ]).subscribe(
      ([resourceHierarchy, resourceTemplateIds, resourceTemplates]) => {
        if (resourceHierarchy && resourceTemplates) {
          const availableTemplates = resourceTemplates.filter((t) =>
            resourceTemplateIds?.includes(t.id)
          );
          console.log('available', availableTemplates, resourceTemplates);

          this.initResourceTypeTemplates(resourceHierarchy, availableTemplates);
          this.dataSource.data = [resourceHierarchy];
          this.resourceHierarchy = resourceHierarchy;
          this.selectNode(this.resourceHierarchy);
        }
      }
    );
  }

  ngOnDestroy() {
    this.resourceTypesSubscription.unsubscribe();
  }

  selectNode(node: EntityTypeDto): boolean {
    const isActiveNode = node.id === this.defaultItem;
    const hasActiveChildren = node.subClasses.some((n) => this.selectNode(n));
    const expandNode = isActiveNode || hasActiveChildren;

    if (expandNode) {
      this.treeControl.expand(node);
    }

    if (isActiveNode) {
      this.handleSelectType(node);
    }

    return expandNode;
  }

  handleSelectType(item: EntityTypeDto) {
    if (item == null) {
      this.activeItem = null;
    } else {
      this.activeItem =
        this.activeItem != null && this.activeItem.id === item.id ? null : item;
    }
  }

  changeResourceType() {
    this.dialogRef.close(this.activeItem);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  createResource() {
    if (
      this.activeItem.selectedResourceTypeTemplate &&
      this.activeItem.selectedResourceTypeTemplate !== ''
    ) {
      this.creationType = ResourceCreationType.COPY;
      this.copyResource(this.activeItem.selectedResourceTypeTemplate, true);
    } else {
      this.router.navigate(['/resource/new'], {
        queryParams: {
          type: this.activeItem.id,
          creationType: this.creationType
        }
      });
    }
  }

  copyResourceRaw() {
    const basedPidUri = this.route.snapshot.queryParamMap.get('based');
    this.copyResource(basedPidUri, false);
  }

  copyResource(pidUri: string, useTemplate: boolean) {
    this.router.navigate(['/resource/new'], {
      queryParams: {
        type: this.activeItem.id,
        based: pidUri,
        creationType: this.creationType,
        useTemplate
      }
    });
  }

  instantSelect(item: EntityTypeDto, isNewCreationType: boolean) {
    this.activeItem = item;
    if (this.dialogRef) {
      this.changeResourceType();
    } else if (isNewCreationType) {
      this.createResource();
    } else {
      const basedPidUri = this.route.snapshot.queryParamMap.get('based');
      this.copyResource(basedPidUri, false);
    }
  }

  private initResourceTypeTemplates(
    entity: EntityTypeDto,
    templateMappings: ResourceTemplateResultDTO[]
  ) {
    entity.resourceTypeTemplates = undefined;
    console.log('mappings', templateMappings);
    if (
      new Set(
        templateMappings.map(
          (template) =>
            template.properties[Constants.ResourceTemplates.HasResourceType][0]
        )
      ).has(entity.id)
    ) {
      const matchingResourceTemplates = templateMappings
        .filter(
          (template) =>
            template.properties[
              Constants.ResourceTemplates.HasResourceType
            ][0] == entity.id
        )
        .map((template) => ({
          templateName: template.name,
          resourcePidUri: template.properties[Constants.Metadata.HasPidUri][0]
        }));
      console.log('match resource temps', matchingResourceTemplates);
      entity.resourceTypeTemplates = matchingResourceTemplates;
      entity.selectedResourceTypeTemplate =
        matchingResourceTemplates[0].resourcePidUri;
    }

    entity.subClasses.forEach((subEntity) =>
      this.initResourceTypeTemplates(subEntity, templateMappings)
    );
  }
}
