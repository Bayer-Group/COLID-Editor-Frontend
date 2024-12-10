import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { map } from 'rxjs/operators';
import { RouteExtension } from 'src/app/shared/extensions/route.extension';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    protected authService: AuthService,
    protected router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('im in canactivate/auth-guard', route, state);
    return this.authService.isLoggedIn$.pipe(
      map((isLoggedIn) => this.processLoggedIn(isLoggedIn, route))
    );
  }

  protected processLoggedIn(
    isLoggedIn: boolean,
    route: ActivatedRouteSnapshot
  ): boolean {
    if (!isLoggedIn) {
      if (!this.authService.loginInProgress) {
        console.log('in process loggedIn/ auth-guard', route);
        RouteExtension.SetRouteInStorage(route);
      }
      this.router.navigate(['/login-in-progress']);
      return false;
    }
    return true;
  }
}
