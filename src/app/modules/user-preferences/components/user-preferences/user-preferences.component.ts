import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SidebarState, SetSidebarOpened } from 'src/app/state/sidebar.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.scss']
})
export class UserPreferencesComponent implements OnInit {
  /**
   * Sidebar is currently no longer needed because the user preferences menu items are directly accessible via the navbar in the user settings 
   *  
   * @Select(SidebarState.sidebarOpened) sidebarOpened$: Observable<any>;
   * @Select(SidebarState.sidebarMode) sidebarMode$: Observable<any>;*/
   

  constructor(private store: Store) { }

  ngOnInit() {}

  setSidebarOpened(event) {
   // this.store.dispatch(new SetSidebarOpened(event)).subscribe();
  }
}
