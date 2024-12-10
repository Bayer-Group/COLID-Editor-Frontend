import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthGuardService } from './auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardEditorService extends AuthGuardService {
  constructor(
    protected authService: AuthService,
    protected router: Router
  ) {
    super(authService, router);
    this.authService.hasCreatePrivilege$.subscribe(
      (val) => (this.hasCreatePrivilege = val)
    );
  }

  hasCreatePrivilege: boolean = false;

  canActivate(route: ActivatedRouteSnapshot) {
    return combineLatest([
      this.authService.isLoggedIn$,
      this.authService.hasCreatePrivilege$
    ]).pipe(
      map(([isLoggedIn, hasCreatePriv]) => {
        const isAuthorized = this.processLoggedIn(isLoggedIn, route);
        if (isAuthorized && !hasCreatePriv) {
          this.router.navigate(['/unauthorized']);
        }
        return hasCreatePriv;
      })
    );
  }
}
