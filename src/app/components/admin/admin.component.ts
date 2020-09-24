import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SidebarState, SetSidebarOpened } from 'src/app/state/sidebar.state';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @Select(SidebarState.sidebarOpened) sidebarOpened$: Observable<any>;
  @Select(SidebarState.sidebarMode) sidebarMode$: Observable<any>;

  constructor(private store: Store) { }

  ngOnInit() {}

  setSidebarOpened(event) {
    this.store.dispatch(new SetSidebarOpened(event)).subscribe();
}

}
