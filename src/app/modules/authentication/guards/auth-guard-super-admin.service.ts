import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { RouteExtension } from 'src/app/shared/extensions/route.extension';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardSuperAdminService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot) {

      if (!this.authService.isLoggedIn) {
        if (!this.authService.loginInProgress) {
          RouteExtension.SetRouteInStorage(route);
        }
        this.router.navigate(['/login-in-progress']);
        return false;
      }

        return this.authService.isAuthorized.pipe(map(isAuthorized => {
            if (isAuthorized && this.authService.hasSuperAdminPrivilege) {
                return true;
            } else {
                this.router.navigate(['/unauthorized']);
                return false;
            }
        }));
    }


}
