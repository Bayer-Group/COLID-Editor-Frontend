import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { RouteExtension } from 'src/app/shared/extensions/route.extension';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdminService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this.authService.isLoggedIn) {
      if (!this.authService.loginInProgress) {
        RouteExtension.SetRouteInStorage(route);
      }

      this.router.navigate(['/login-in-progress']);
      return false;
    }

    return this.authService.isAuthorized.pipe(map(isAuthorized => {
      if (isAuthorized && (this.authService.hasAdminPrivilege || this.authService.hasSuperAdminPrivilege)) {
        return true;
      } else {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }));
  }


}
