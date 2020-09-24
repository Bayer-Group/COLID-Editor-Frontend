import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { MetaDataState, FetchHierarchy } from 'src/app/state/meta-data.state';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { EntityTypeDto } from 'src/app/shared/models/Entities/entity-type-dto';

@Component({
  selector: 'app-resource-hierarchy',
  templateUrl: './resource-hierarchy.component.html',
  styleUrls: ['./resource-hierarchy.component.scss']
})
export class ResourceHierarchyComponent implements OnInit, OnDestroy {
  @Select(MetaDataState.hierarchy) resourceTypes$: Observable<EntityTypeDto>;

  resourceType: EntityTypeDto;
  activeItem: EntityTypeDto;
  resourceTypesSubscription: Subscription;

  constructor(private store: Store, private router: Router) { }

  ngOnInit() {
    this.store.dispatch([new FetchHierarchy()]).subscribe();
    
    this.resourceTypesSubscription = this.resourceTypes$.subscribe((resourceTypes: EntityTypeDto) => {
        this.resourceType = resourceTypes;
    });
  }

  ngOnDestroy(){
    this.resourceTypesSubscription.unsubscribe();
  }

  handleSelectType(item: EntityTypeDto) {
    if (item == null) {
      this.activeItem = null;
    } else {
      this.activeItem = this.activeItem != null && this.activeItem.id === item.id ? null : item;
    }
  }
  createResource() {
    this.router.navigate(['/resource/new'], { queryParams: { type: this.activeItem.id } });
  }
}
