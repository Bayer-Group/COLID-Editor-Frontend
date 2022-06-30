import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { LogService } from 'src/app/core/logging/log.service';
import { Router } from '@angular/router';
import { ResourceSearchDTO } from 'src/app/shared/models/search/resource-search-dto';
import { ResourceOverviewState, FetchNextResourceBatch, SetSidebarSearch, SetInitialSidebarSearch } from 'src/app/state/resource-overview.state';
import { Observable } from 'rxjs';
import { ResourceOverviewCTO } from 'src/app/shared/models/resources/resource-overview-cto';
import { SidebarState, ClickedSidebarLink } from 'src/app/state/sidebar.state';
import { ResourceOverviewDTO } from 'src/app/shared/models/resources/resource-overview-dto';
import { SearchResult } from 'src/app/shared/models/search/search-result';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    @Select(ResourceOverviewState.searchResult) searchResult$: Observable<SearchResult>;
    @Select(ResourceOverviewState.loading) loading$: Observable<boolean>;

    @Select(SidebarState.sidebarMode) sidebarMode$: Observable<string>;
    currentPageStatus: string;
    selectedResourcePidUri: string;

    constructor(private logger: LogService, private router: Router, private store: Store) {

    }

    ngOnInit() { 
        this.currentPageStatus = "listSideNav";
    }

    handleResourceSelectionChanged(selectedResourcePidUri: string) {
        this.logger.info('PID_SIDEBAR_FILTER_RESOURCE_SELECTED', { 'resourcePidUri': selectedResourcePidUri });
        this.router.navigate(['resource'], { queryParams: { pidUri: selectedResourcePidUri } })
            .then(t => {
                if (t) {
                    this.selectedResourcePidUri = selectedResourcePidUri;
        }
            });

        window.scrollTo(0, 0);

        this.store.dispatch(new ClickedSidebarLink()).subscribe();
    }

    handleResourceSearchChanged(resourceSearchObject: ResourceSearchDTO) {
        this.store.dispatch(new SetSidebarSearch(resourceSearchObject)).subscribe();         
    }

    handleNextResourceBatch(offset: number) {
        this.store.dispatch(new FetchNextResourceBatch(offset)).subscribe();
    }
}
