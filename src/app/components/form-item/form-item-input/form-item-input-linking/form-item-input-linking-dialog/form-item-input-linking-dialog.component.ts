import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ResourceSearchDTO } from 'src/app/shared/models/search/resource-search-dto';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchResult } from 'src/app/shared/models/search/search-result';
import { SearchService } from 'src/app/core/http/search.service';
import { Select } from '@ngxs/store';
import {
  MetaDataState,
  MetaDataStateModel
} from 'src/app/state/meta-data.state';

@Component({
  selector: 'app-form-item-input-linking-dialog',
  templateUrl: './form-item-input-linking-dialog.component.html',
  styleUrls: ['./form-item-input-linking-dialog.component.scss']
})
export class FormItemInputLinkingDialogComponent implements OnInit, OnDestroy {
  resetScrolling = new Subject<void>();
  resetScrolling$ = this.resetScrolling.asObservable();
  @Select(MetaDataState.linkResourcesTypes) linkResourcesTypes$: Observable<
    Map<string, string[]>
  >;

  searchResultState$: BehaviorSubject<SearchResult> = new BehaviorSubject(null);
  selectedResource: string = null;

  loading = new BehaviorSubject(true);
  resourceSearchObject: ResourceSearchDTO;
  linkResourceTypes: Map<string, string[]> = new Map<string, string[]>();

  actualPidUri: string;
  currentPageStatus: string;
  linkResourcesTypesSubscription: Subscription;
  mapsStore$: Observable<MetaDataStateModel>;
  constructor(
    private searchService: SearchService,
    @Inject(MAT_DIALOG_DATA) public range: string,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.actualPidUri = this.route.snapshot.queryParamMap.get('pidUri');
    this.currentPageStatus = 'listCreateLink';
    this.linkResourcesTypesSubscription = this.linkResourcesTypes$.subscribe(
      (result) => (this.linkResourceTypes = result)
    );
  }

  handleResourceSearchChanged(resourceSearchObject: ResourceSearchDTO) {
    this.loading.next(true);
    this.resetScrolling.next();
    this.resourceSearchObject = resourceSearchObject;
    resourceSearchObject.published = true;

    if (this.range != null) {
      this.resourceSearchObject.type = this.range;
    }
    var eligableLinks = this.linkResourceTypes[this.range];

    this.searchService
      .search(resourceSearchObject, undefined, true, eligableLinks)
      .subscribe((result) => {
        this.searchResultState$.next(result);
        this.loading.next(false);
      });
  }

  handleNextResourceBatch(payload) {
    // offset mean already loaded records plus limit.
    // If already loaded records is more than the payload (rendered rows), no need to load further.
    if (this.resourceSearchObject.offset > payload) {
      return;
    }

    const searchResultState = this.searchResultState$.getValue();
    if (this.range != null) {
      this.resourceSearchObject.type = this.range;
    }
    var eligableLinks = this.linkResourceTypes[this.range];
    this.resourceSearchObject.offset =
      this.resourceSearchObject.offset + this.resourceSearchObject.limit;
    this.resourceSearchObject.published = true;
    this.loading.next(true);
    this.searchService
      .search(this.resourceSearchObject, undefined, true, eligableLinks)
      .subscribe(
        (searchResult) => {
          if (
            this.resourceSearchObject.offset >=
            searchResultState.hits.hits.length
          ) {
            searchResult.hits.hits = [
              ...searchResultState.hits.hits,
              ...searchResult.hits.hits
            ];

            this.searchResultState$.next({ ...searchResult });
          }
          this.loading.next(false);
        },
        (_) => {
          this.loading.next(false);
        }
      );
  }

  handleResourceSelectionChanged(selectedResource: string) {
    this.selectedResource = selectedResource;
  }
  ngOnDestroy() {
    this.linkResourcesTypesSubscription.unsubscribe();
  }
}
