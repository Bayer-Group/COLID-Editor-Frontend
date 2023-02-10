import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Subscription } from 'rxjs'
import { LogService } from 'src/app/core/logging/log.service';
import { Router } from '@angular/router';
import { ResourceSearchDTO } from 'src/app/shared/models/search/resource-search-dto';
import { ResourceOverviewState, FetchNextResourceBatch, SetSidebarSearch } from 'src/app/state/resource-overview.state';
import { Observable, Subject } from 'rxjs';
import { SidebarState, ClickedSidebarLink } from 'src/app/state/sidebar.state';
import { SearchResult } from 'src/app/shared/models/search/search-result';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
    @Select(ResourceOverviewState.searchResult) searchResult$: Observable<SearchResult>;
    @Select(ResourceOverviewState.loading) loading$: Observable<boolean>;
    @Select(ResourceOverviewState.initialLoad) initialLoad$: Observable<boolean>;
    initialLoadSub: Subscription;
    resetScrolling = new Subject<void>();
    resetScrolling$ = this.resetScrolling.asObservable();

    @Select(SidebarState.sidebarMode) sidebarMode$: Observable<string>;
    currentPageStatus: string;
    selectedResourcePidUri: string;

    constructor(private logger: LogService, private router: Router, private store: Store) {

    }

    ngOnInit() { 
        this.currentPageStatus = "listSideNav";
        this.initialLoadSub = this.initialLoad$.subscribe((initialLoad: boolean) => {
            if (initialLoad) {
                this.resetScrolling.next();
            }
        })
    }

    ngOnDestroy() {
        this.initialLoadSub.unsubscribe();
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
        this.resetScrolling.next();
        this.store.dispatch(new SetSidebarSearch(resourceSearchObject)).subscribe();         
    }

    handleNextResourceBatch(offset: number) {
        this.store.dispatch(new FetchNextResourceBatch(offset)).subscribe();
    }
}
