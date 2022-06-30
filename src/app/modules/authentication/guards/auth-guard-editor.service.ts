import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { combineLatest, timer } from 'rxjs';
import { map, debounce } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthGuardService } from './auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardEditorService extends AuthGuardService implements CanActivate {
  
  constructor(protected authService: AuthService, protected router: Router) {
    super(authService, router)
    this.authService.hasCreatePrivilege$.subscribe(val => this.hasCreatePrivilege = val)
  }

  hasCreatePrivilege : boolean = false;

  canActivate(route: ActivatedRouteSnapshot) {
    return combineLatest([this.authService.isLoggedIn$, this.authService.hasCreatePrivilege$])
      .pipe(
        // TODO: timer should be eliminated. It is used to wait for hasCreatePrivilege to become true (i.e. userInfo.consumerGroups to be filled)
        // USECASE: when creating a resource, reload the page. Without timer the user get's sent to unauthorized page
        debounce(() => !this.hasCreatePrivilege ? timer(60000) : timer(0)),
        map(([isLoggedIn, hasCreatePriv]) => {
        const isAuthorized = this.processLoggedIn(isLoggedIn, route);
        if (isAuthorized && !hasCreatePriv) {
          this.router.navigate(['/unauthorized']);
        }
        return hasCreatePriv;
      }));
  }
}