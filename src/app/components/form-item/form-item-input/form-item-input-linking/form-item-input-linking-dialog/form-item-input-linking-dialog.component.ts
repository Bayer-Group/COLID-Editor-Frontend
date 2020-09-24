import { Component, OnInit, Inject } from '@angular/core';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';
import { BehaviorSubject } from 'rxjs';
import { ResourceOverviewCTO } from 'src/app/shared/models/resources/resource-overview-cto';
import { ResourceSearchDTO } from 'src/app/shared/models/search/resource-search-dto';
import { ResourceOverviewDTO } from 'src/app/shared/models/resources/resource-overview-dto';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-item-input-linking-dialog',
  templateUrl: './form-item-input-linking-dialog.component.html',
  styleUrls: ['./form-item-input-linking-dialog.component.scss']
})
export class FormItemInputLinkingDialogComponent implements OnInit {

  resourceOverviewState$: BehaviorSubject<ResourceOverviewCTO> = new BehaviorSubject(null);
  selectedResource: ResourceOverviewDTO = null;

  loading = new BehaviorSubject(true);
  resourceSearchObject: ResourceSearchDTO;

  actualPidUri: string;
  currentPageStatus:string
  constructor(private resourceService: ResourceApiService, @Inject(MAT_DIALOG_DATA) public range: string, private route: ActivatedRoute) { }

  ngOnInit() {
    this.actualPidUri = this.route.snapshot.queryParamMap.get('pidUri');
    this.currentPageStatus="listCreateLink";
  }

  handleResourceSearchChanged(resourceSearchObject: ResourceSearchDTO) {
    this.loading.next(true);

    this.resourceSearchObject = resourceSearchObject;

    if (this.range != null) {
      this.resourceSearchObject.type = this.range;
    }

    this.resourceService.getFilteredResources(resourceSearchObject).subscribe(result => {
      this.resourceOverviewState$.next(result);
      this.loading.next(false);
    });
  }

  handleNextResourceBatch(payload) {
    // offset mean already loaded records plus limit.
    // If already loaded records is more than the payload (rendered rows), no need to load further.
    if (this.resourceSearchObject.offset > payload) {
      return;
    }

    const resourceOverviewState = this.resourceOverviewState$.getValue();

    this.resourceSearchObject.offset = this.resourceSearchObject.offset + this.resourceSearchObject.limit;

    this.loading.next(true);
    this.resourceService.getFilteredResources(this.resourceSearchObject).subscribe(res => {
      if (this.resourceSearchObject.offset >= resourceOverviewState.items.length) {

        const mergedState = resourceOverviewState;
        mergedState.items = [...resourceOverviewState.items, ...res.items];

        this.resourceOverviewState$.next({ ...mergedState });
      }
      this.loading.next(false);
    }, error => {
      this.loading.next(false);
    });
  }

  handleResourceSelectionChanged(selectedResource: ResourceOverviewDTO) {
    this.selectedResource = selectedResource;
    console.log('selected', this.selectedResource);
  }
}
