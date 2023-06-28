import { Component } from "@angular/core";
import { Store } from "@ngxs/store";

@Component({
  selector: "app-user-preferences",
  templateUrl: "./user-preferences.component.html",
  styleUrls: ["./user-preferences.component.scss"],
})
export class UserPreferencesComponent {
  /**
   * Sidebar is currently no longer needed because the user preferences menu items are directly accessible via the navbar in the user settings
   *
   * @Select(SidebarState.sidebarOpened) sidebarOpened$: Observable<any>;
   * @Select(SidebarState.sidebarMode) sidebarMode$: Observable<any>;*/

  constructor(private store: Store) {}

  setSidebarOpened(_) {
    // this.store.dispatch(new SetSidebarOpened(event)).subscribe();
  }
}
