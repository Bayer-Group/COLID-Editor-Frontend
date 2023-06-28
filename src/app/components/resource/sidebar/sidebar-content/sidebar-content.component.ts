import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable, Subscription } from "rxjs";
import { Constants } from "src/app/shared/constants";
import { ResourceState } from "src/app/state/resource.state";
import { Resource } from "../../../../shared/models/resources/resource";
import { SearchResult } from "src/app/shared/models/search/search-result";

@Component({
  selector: "app-sidebar-content",
  templateUrl: "./sidebar-content.component.html",
  styleUrls: ["./sidebar-content.component.scss"],
})
export class SidebarContentComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  constants = Constants;
  @Input() selectedResourcePidUri = "";

  @Select(ResourceState.activeResource) activeResource$: Observable<Resource>;
  @Output() resourceSelectedEvent: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() nextResourceBatchEvent: EventEmitter<number> =
    new EventEmitter<number>();
  totalResources = null;

  @Input() searchResultState: Observable<SearchResult>;
  @Input() loadingState: Observable<boolean>;
  @Input() currentPageStatus: string;
  @Input() resetScrolling: Observable<boolean>;

  @ViewChild("results", { static: false }) results;

  activeResourceSubscription: Subscription;
  resourceOverviewStateSubscription: Subscription;
  resetScrollingSubscription: Subscription;

  constructor() {
    this.activeResourceSubscription = this.activeResource$.subscribe((res) => {
      if (res) {
        this.selectedResourcePidUri = res.pidUri;
      } else {
        this.selectedResourcePidUri = null;
      }
    });
  }

  ngOnInit() {
    this.resourceOverviewStateSubscription = this.searchResultState.subscribe(
      (res) => {
        if (res != null) {
          this.totalResources = res.hits.total;

          setTimeout(() => {
            if (
              this.results != null &&
              this.results.nativeElement != null &&
              this.results.nativeElement.scrollHeight <=
                this.results.nativeElement.offsetHeight
            ) {
              this.nextBatch(res.hits.hits.length);
            }
          }, 100);
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.resetScrollingSubscription = this.resetScrolling.subscribe(
      (_) => (this.results._elementRef.nativeElement.scrollTop = 0)
    );
  }

  ngOnDestroy() {
    this.activeResourceSubscription.unsubscribe();
    this.resourceOverviewStateSubscription.unsubscribe();
    this.resetScrollingSubscription.unsubscribe();
  }

  selectResource(resourcePidUri: string) {
    this.resourceSelectedEvent.emit(resourcePidUri);
  }

  nextBatch(offset: number) {
    if (this.totalResources <= offset) {
      return;
    }

    this.nextResourceBatchEvent.emit(offset);
  }
}
