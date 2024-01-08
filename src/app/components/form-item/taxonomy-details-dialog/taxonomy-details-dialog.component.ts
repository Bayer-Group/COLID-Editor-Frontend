import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Subscription, fromEvent, of } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from "rxjs/operators";
import { AppMaterialModule } from "src/app/app-material.module";
import { TaxonomyService } from "src/app/core/http/taxonomy.api.service";
import { TaxonomyResultDTO } from "src/app/shared/models/taxonomy/taxonomy-result-dto";
import { TreeViewSelectionChangeEvent } from "src/app/shared/models/tree-view-selection-change-event";
import { SharedModule } from "src/app/shared/shared.module";

export interface TaxonomyDialogData {
  taxonomyList: TaxonomyResultDTO[];
  taxonomyType: string;
  singleSelection: boolean;
  selectedNodeIds: string[];
}

@Component({
  standalone: true,
  selector: "app-taxonomy-details-dialog",
  templateUrl: "./taxonomy-details-dialog.component.html",
  styleUrls: ["./taxonomy-details-dialog.component.css"],
  imports: [AppMaterialModule, SharedModule],
})
export class TaxonomyDetailsDialogComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild("searchbar") input: ElementRef;
  singleSelection = false;
  selectedNodeIds: string[] = [];
  selectedNodes: TaxonomyResultDTO[] = [];
  sub: Subscription = new Subscription();
  loading: boolean = false;
  originalTaxonomyList: TaxonomyResultDTO[] = [];
  displayedTaxonomyList: TaxonomyResultDTO[] = [];
  searchTriggered: boolean = false;
  currentSearchItem: number = 0;
  totalSearchItems: number = 0;
  taxonomysToExpand: TaxonomyResultDTO[] = [];
  searchedTaxonomies: TaxonomyResultDTO[] = [];
  highlightedTaxonomyDetail: TaxonomyResultDTO | null = null;

  constructor(
    public dialogRef: MatDialogRef<TaxonomyDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: TaxonomyDialogData,
    private taxonomyApiService: TaxonomyService
  ) {
    this.originalTaxonomyList = data.taxonomyList;
    this.displayedTaxonomyList = this.originalTaxonomyList.slice();
    this.singleSelection = data.singleSelection;
    this.selectedNodeIds = data.selectedNodeIds;
  }

  ngAfterViewInit() {
    this.sub.add(
      fromEvent(this.input.nativeElement, "keyup")
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((_) => {
            if (this.input.nativeElement.value != "") {
              this.loading = true;
              return this.taxonomyApiService.searchTaxonomy(
                this.data.taxonomyType,
                this.input.nativeElement.value
              );
            } else {
              return of([]);
            }
          }),
          catchError((_) => {
            this.loading = false;
            return of([]);
          })
        )
        .subscribe((res) => {
          if (res.length > 0) {
            this.searchTriggered = true;
            this.currentSearchItem = 0;
            this.searchedTaxonomies = [];
            this.highlightedTaxonomyDetail = null;
            res.forEach((taxonomy) => {
              this.expandNodesForSearch(taxonomy);
              this.getSearchedTaxonomiesDetails(taxonomy);
            });
            this.totalSearchItems = this.searchedTaxonomies.length;
            if (this.searchedTaxonomies.length > 0) {
              this.highlightedTaxonomyDetail = this.searchedTaxonomies[0];
            }
            this.displayedTaxonomyList = res;
          } else {
            this.searchTriggered = false;
            this.displayedTaxonomyList = this.originalTaxonomyList;
          }
          this.loading = false;
        })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  showNextSearchResult() {
    let nodeElements = document.getElementsByClassName("searchhit");
    if (this.currentSearchItem === this.totalSearchItems - 1) {
      this.currentSearchItem = 0;
    } else {
      this.currentSearchItem++;
    }
    nodeElements[this.currentSearchItem].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    this.highlightedTaxonomyDetail =
      this.searchedTaxonomies[this.currentSearchItem];
  }

  showPreviousSearchResult() {
    let nodeElements = document.getElementsByClassName("searchhit");
    if (this.currentSearchItem === 0) {
      this.currentSearchItem = this.totalSearchItems - 1;
    } else {
      this.currentSearchItem--;
    }
    nodeElements[this.currentSearchItem].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    this.highlightedTaxonomyDetail =
      this.searchedTaxonomies[this.currentSearchItem];
  }

  private expandNodesForSearch(taxonomy: TaxonomyResultDTO) {
    if (taxonomy.expanded) {
      this.taxonomysToExpand.push(taxonomy);
    }

    if (taxonomy.hasChild) {
      taxonomy.children.forEach((childTaxonomy) => {
        this.expandNodesForSearch(childTaxonomy);
      });
    }
  }

  private getSearchedTaxonomiesDetails(taxonomy: TaxonomyResultDTO) {
    if (taxonomy.foundInSearch) {
      this.searchedTaxonomies.push(taxonomy);
    }

    if (taxonomy.hasChild) {
      taxonomy.children.forEach((childTaxonomy) => {
        this.getSearchedTaxonomiesDetails(childTaxonomy);
      });
    }
  }

  handleSelectionChanged(event: TreeViewSelectionChangeEvent) {
    if (!event.initialChange) {
      this.selectedNodes = event.values;
      this.selectedNodeIds = this.selectedNodes.map((x) => x.id);
    }
  }

  applySelectedValues() {
    this.dialogRef.close({
      selectedNodes: this.selectedNodes,
    });
  }

  showDetailsForTaxonomy(taxonomy: TaxonomyResultDTO) {
    this.highlightedTaxonomyDetail = taxonomy;
  }
}
