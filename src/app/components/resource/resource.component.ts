import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SidebarState, SetSidebarOpened } from 'src/app/state/sidebar.state';
import { FetchPidUriTemplates } from 'src/app/state/pid-uri-template.state';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {
  @Select(SidebarState.sidebarOpened) sidebarOpened$: Observable<any>;
  @Select(SidebarState.sidebarMode) sidebarMode$: Observable<any>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new FetchPidUriTemplates()).subscribe();
  }

  setSidebarOpened(event) {
    this.store.dispatch(new SetSidebarOpened(event)).subscribe();
  }
}
