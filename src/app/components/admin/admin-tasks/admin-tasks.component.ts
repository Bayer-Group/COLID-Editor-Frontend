import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ClickedSidebarLink } from 'src/app/state/sidebar.state';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-tasks',
  templateUrl: './admin-tasks.component.html',
  styleUrls: ['./admin-tasks.component.css']
})
export class AdminTasksComponent implements OnInit {

  constructor(private store: Store, private authService: AuthService) { }

  ngOnInit() {}

  get hasSuperAdminPrivilege$(): Observable<boolean> {
    return this.authService.hasSuperAdminPrivilege$;
  }

  linkClicked() {
    this.store.dispatch(new ClickedSidebarLink()).subscribe();
  }
}
