import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { RouteExtension } from 'src/app/shared/extensions/route.extension';
import { Injectable } from '@angular/core';
import { FetchConsumerGroupsByUser } from 'src/app/state/user-info.state';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
;

@Injectable({
  providedIn: 'root'
})
export class AuthGuardEditorService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private store: Store) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if (!this.authService.isLoggedIn) {
      if (!this.authService.loginInProgress) {
        RouteExtension.SetRouteInStorage(route);
      }
      this.router.navigate(['/login-in-progress']);
    }

    return new Observable(observer => {
      this.store.dispatch(new FetchConsumerGroupsByUser).
      subscribe(result => {
        if (result.UserInfo.fetched && result.UserInfo.consumerGroups.length > 0) {
          return observer.next(true);
        } else {
          this.router.navigate(['/unauthorized']);
          return observer.next(false);
        }
      })
    });
  }
}
