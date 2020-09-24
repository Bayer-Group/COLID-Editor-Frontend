import { Component, Output, EventEmitter, Input, ViewChild, OnInit, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Select} from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Constants } from 'src/app/shared/constants';
import { ResourceOverviewDTO } from 'src/app/shared/models/resources/resource-overview-dto';
import { ResourceState } from 'src/app/state/resource.state';
import { Resource } from '../../../../shared/models/resources/resource';
import { ResourceOverviewCTO } from 'src/app/shared/models/resources/resource-overview-cto';

@Component({
  selector: 'app-sidebar-content',
  templateUrl: './sidebar-content.component.html',
  styleUrls: ['./sidebar-content.component.scss']
})
export class SidebarContentComponent implements OnInit, OnDestroy {
  constants = Constants;
  @Input() selectedResourcePidUri = '';

  @Select(ResourceState.activeResource) activeResource$: Observable<Resource>;
  @Output() resourceSelectedEvent: EventEmitter<ResourceOverviewDTO> = new EventEmitter<ResourceOverviewDTO>();
  @Output() nextResourceBatchEvent: EventEmitter<number> = new EventEmitter<number>();
  totalResources = null;

  @Input() resourceOverviewState: Observable<ResourceOverviewCTO>;
  @Input() loadingState: Observable<boolean>;
  @Input() currentPageStatus:string

  @ViewChild('results', { static: false }) results: ElementRef;

  activeResourceSubscription: Subscription;
  resourceOverviewStateSubscription: Subscription;

  constructor() {
    this.activeResourceSubscription = this.activeResource$.subscribe(res => {
      if (res) {
        this.selectedResourcePidUri = res.pidUri;
      } else {
        this.selectedResourcePidUri = null;
      }
    });
  }

  ngOnInit() {
    this.resourceOverviewStateSubscription = this.resourceOverviewState.subscribe(res => {
      if (res != null) {
        this.totalResources = res.total;

        setTimeout(() => {
          if (this.results != null && this.results.nativeElement != null && this.results.nativeElement.scrollHeight <= this.results.nativeElement.offsetHeight) {
            this.nextBatch(null, res.items.length);
          }
        }, 100);
      }
    });

    
  }

  ngOnDestroy() {
    this.activeResourceSubscription.unsubscribe();
    this.resourceOverviewStateSubscription.unsubscribe();
  }

  selectResource(resourceOverviewDTO: ResourceOverviewDTO) {
    this.resourceSelectedEvent.emit(resourceOverviewDTO);
  }

  public isActive(resource: ResourceOverviewDTO): boolean {
    return this.selectedResourcePidUri === resource.pidUri;
  }

  nextBatch(currIndex: number, offset: number) {
    if (this.totalResources <= offset) { return; }

    console.log('sidebarIndex', currIndex);
    this.nextResourceBatchEvent.emit(offset);
  }

  getStrippedHtml(str: string){
    const re_tags = new RegExp(/<[a-zA-Z\/][^>]*>/g)
    return str.replace(re_tags, '');
  }
}