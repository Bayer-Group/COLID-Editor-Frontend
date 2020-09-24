import { Component, OnInit } from '@angular/core';
import { ResourceState, FetchHistoricResource, FetchResourceHistory } from 'src/app/state/resource.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MetaDataState } from 'src/app/state/meta-data.state';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Resource } from 'src/app/shared/models/resources/resource';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoricResourceOverviewDTO } from 'src/app/shared/models/resources/historic-resource-overview-dto';
import { VersionProperty } from 'src/app/shared/models/resources/version-property';

@Component({
  selector: 'app-resource-history',
  templateUrl: './resource-history.component.html',
  styleUrls: ['./resource-history.component.css']
})
export class ResourceHistoryComponent implements OnInit {
  @Select(ResourceState.getResourceHistory) history$: Observable<Array<HistoricResourceOverviewDTO>>;
  @Select(ResourceState.getHistoricResources) historicResources$: Observable<Map<string, Resource>>;
  @Select(MetaDataState.metadata) metadata$: Observable<Map<string, Array<MetaDataProperty>>>;
  @Select(ResourceState.getSelectedHistoricResource) selectedHistoricResource$: Observable<string>;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const resourcePidUri = this.route.snapshot.queryParamMap.get('pidUri');

    this.store.dispatch(new FetchResourceHistory(resourcePidUri)).subscribe();
  }

  handleSelectionChanged(event: HistoricResourceOverviewDTO) {
    this.store.dispatch(new FetchHistoricResource(event));
  }

  handleVersionClicked(event: VersionProperty) {
    this.router.navigate(['/resource'], { queryParams: { pidUri: event.pidUri } });
  }

}
