import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { UserInfoState } from 'src/app/state/user-info.state';
import { Observable } from 'rxjs';
import { ResourceSearchDTO } from 'src/app/shared/models/search/resource-search-dto';
import { LogService } from 'src/app/core/logging/log.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { SearchResult } from 'src/app/shared/models/search/search-result';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar-filter.component.html',
  styleUrls: ['./sidebar-filter.component.scss']
})
export class SidebarFilterComponent implements OnInit {
  @Output() resourceSearchEvent = new EventEmitter<ResourceSearchDTO>();

  @Input() searchResultState: Observable<SearchResult>;

  filters = {
    searchText: '',
    draft: false,
    published: false,
    consumerGroup: false,
    lastChanged: false,
    markedForDeletion: false
  };

  sequenceDesc = false;

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
        Predicate: Constants.Metadata.HasLabel,
        Sequence: 'asc'
      },
      value: 'Label'
    },
    {
      key: {
        Predicate:  Constants.Metadata.LastChangeDateTime,
        Sequence: 'asc'
      },
      value: 'Last Change Date'
    },
    {
      key: {
        Predicate: Constants.Metadata.DateCreated,
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
    this.authService.currentEmail$.subscribe(userEmail => this.userEmail = userEmail)
    this.filter();
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
