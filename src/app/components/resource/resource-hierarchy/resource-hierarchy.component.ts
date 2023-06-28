import { Component, OnInit, OnDestroy, Optional } from "@angular/core";
import { Store, Select } from "@ngxs/store";
import { MetaDataState, FetchHierarchy } from "src/app/state/meta-data.state";
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { EntityTypeDto } from "src/app/shared/models/Entities/entity-type-dto";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { ResourceCreationType } from "src/app/shared/models/resources/resource-creation-type";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-resource-hierarchy",
  templateUrl: "./resource-hierarchy.component.html",
  styleUrls: ["./resource-hierarchy.component.scss"],
})
export class ResourceHierarchyComponent implements OnInit, OnDestroy {
  @Select(MetaDataState.hierarchy) resourceTypes$: Observable<EntityTypeDto>;

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
    this.store.dispatch([new FetchHierarchy()]).subscribe();

    const queryParamMap = this.route.snapshot.queryParamMap;

    if (queryParamMap.has("type")) {
      this.defaultItem = queryParamMap.get("type");
    }
    if (queryParamMap.has("creationType")) {
      this.creationType = <ResourceCreationType>(
        this.route.snapshot.queryParamMap.get("creationType")
      );
    }

    this.resourceTypesSubscription = this.resourceTypes$.subscribe(
      (resourceHierarchy: EntityTypeDto) => {
        this.dataSource.data = [resourceHierarchy];
        this.resourceHierarchy = resourceHierarchy;
        if (resourceHierarchy) {
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
    this.router.navigate(["/resource/new"], {
      queryParams: {
        type: this.activeItem.id,
        creationType: this.creationType,
      },
    });
  }

  copyResource() {
    const basedPidUri = this.route.snapshot.queryParamMap.get("based");
    this.router.navigate(["/resource/new"], {
      queryParams: {
        type: this.activeItem.id,
        based: basedPidUri,
        creationType: this.creationType,
      },
    });
  }

  instantSelect(item: EntityTypeDto, isNewCreationType: boolean) {
    this.activeItem = item;
    if (this.dialogRef) {
      this.changeResourceType();
    } else if (isNewCreationType) {
      this.createResource();
    } else {
      this.copyResource();
    }
  }
}
