import { Component, Output, EventEmitter, OnInit, Input, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { UserInfoState } from 'src/app/state/user-info.state';
import { Observable, Subscription } from 'rxjs';
import { ResourceSearchDTO } from 'src/app/shared/models/search/resource-search-dto';
import { LogService } from 'src/app/core/logging/log.service';
import { ResourceOverviewCTO } from 'src/app/shared/models/resources/resource-overview-cto';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { SearchFilterEditor } from 'src/app/shared/models/user/search-filter-editor';
import { SearchResult } from 'src/app/shared/models/search/search-result';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar-filter.component.html',
  styleUrls: ['./sidebar-filter.component.scss']
})
export class SidebarFilterComponent implements OnInit, OnDestroy {
  @Select(UserInfoState.getSelectedConsumerGroupId) selectedConsumerGroupId$: Observable<string>;
  @Select(UserInfoState.getSearchFilterEditor) searchFilterEditor$: Observable<SearchFilterEditor>;

  @Output() resourceSearchEvent = new EventEmitter<ResourceSearchDTO>();

  @Input() searchResultState: Observable<SearchResult>;

  searchFilterEditorSubscription: Subscription;
  selectedConsumerGroupIdSubscription: Subscription;

  filters = {
    searchText: '',
    draft: false,
    published: false,
    consumerGroup: false,
    lastChanged: false,
    markedForDeletion: false
  };

  sequenceDesc = true;

  filterVocabulary =
    [
      { key: 'consumerGroup', label: 'My group' },
      { key: 'lastChanged', label: 'My last change' },
      { key: 'draft', label: 'draft' },
      { key: 'published', label: 'published' }
    ];

  limitList = [10, 20, 50, 100, 200, 500];
  limitSelected = 20;
  offsetSelected = 0;
  orderVocabulary = [
    {
      key: {
        Predicate: 'https://pid.bayer.com/kos/19050/hasLabel',
        Sequence: 'asc'
      },
      value: 'Label'
    },
    {
      key: {
        Predicate: 'https://pid.bayer.com/kos/19050/lastChangeDateTime',
        Sequence: 'asc'
      },
      value: 'Last Change Date'
    },
    {
      key: {
        Predicate: 'https://pid.bayer.com/kos/19050/dateCreated',
        Sequence: 'asc'
      },
      value: 'Created Date'
    }
  ];
  orderSelected: any = this.orderVocabulary[0];

  userEmail: string;

  constructor(private logger: LogService, private store: Store, private authService: AuthService) {
    if (environment.enableIndexSearch) {
      this.orderVocabulary.push({
        key: {
          Predicate: '_score',
          Sequence: 'desc'
        },
        value: 'Score'
      })
    }
  }

  ngOnInit() {
    this.selectedConsumerGroupIdSubscription = this.selectedConsumerGroupId$.subscribe(cgId => {
        this.filter();
    });

    this.authService.currentEmail$.subscribe(userEmail => this.userEmail = userEmail)

    this.searchFilterEditorSubscription = this.searchFilterEditor$.subscribe((searchFilterEditor: SearchFilterEditor) => {
      if (searchFilterEditor != null) {
        this.filters.draft = searchFilterEditor.filterJson.draft;
        this.filters.published = searchFilterEditor.filterJson.published;
        this.filters.markedForDeletion = searchFilterEditor.filterJson.markedForDeletion;
        this.filters.searchText = searchFilterEditor.filterJson.searchText;
        this.filters.lastChanged = searchFilterEditor.filterJson.lastChangeUser != null ? true : false;
        this.filters.consumerGroup = searchFilterEditor.filterJson.consumerGroup != null ? true : false;
        this.limitSelected = searchFilterEditor.filterJson.limit;
        this.offsetSelected = searchFilterEditor.filterJson.offset;
        this.orderSelected = this.orderVocabulary.find(ov => ov.key.Predicate === searchFilterEditor.filterJson.orderPredicate);
        this.sequenceDesc = searchFilterEditor.filterJson.sequence == 'desc' ? true : false;

        this.filter();
        //this.searchFilterEditorSubscription.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.searchFilterEditorSubscription.unsubscribe();
    this.selectedConsumerGroupIdSubscription.unsubscribe();
  }

  filter(key: string = null) {
    if (key !== null) {
      this.filters[key] = !this.filters[key];
    }

    const resourceSearchObject: ResourceSearchDTO = {
      draft: this.filters.draft,
      published: this.filters.published,
      markedForDeletion: this.filters.markedForDeletion,
      searchText: (this.filters.searchText && this.filters.searchText.split("\"").length - 1==1) ? this.filters.searchText.replace("\"","") : this.filters.searchText,
      lastChangeUser: this.filters.lastChanged ? this.userEmail : null,
      consumerGroup: this.filters.consumerGroup ? this.store.selectSnapshot(UserInfoState.getSelectedConsumerGroupId) : null,
      limit: this.limitSelected,
      offset: this.offsetSelected,
      pidUris: new Array<string>(),
      author: '',
      type: '',
      orderPredicate: this.orderSelected.key.Predicate,
      sequence: this.sequenceDesc ? 'desc' : 'asc'
    };

    this.logger.info('PID_SIDEBAR_FILTER_RESOURCE_SEARCHED', { 'searchText': this.filters.searchText });

    this.resourceSearchEvent.emit(resourceSearchObject);
  }
}
