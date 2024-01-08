import { Observable, Subscription } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { Select } from "@ngxs/store";
import {
  UserInfoStateModel,
  UserInfoState,
} from "src/app/state/user-info.state";
import { Router } from "@angular/router";
import { RolePermissions } from "../role-permissions";
import { IdentityProvider } from "./identity-provider.service";
import { ColidAccount } from "../models/colid-account.model";
import { Injectable, Inject } from "@angular/core";
import { IDENT_PROV } from "src/app/shared/constants";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  @Select(UserInfoState) userInfoState$: Observable<UserInfoStateModel>;

  constructor(
    @Inject(IDENT_PROV) private identityProvider: IdentityProvider,
    private router: Router
  ) {}

  get currentIdentity$(): Observable<ColidAccount> {
    return this.identityProvider.getAccount();
  }

  get currentEmail$(): Observable<string> {
    return this.currentIdentity$.pipe(map((id) => (id ? id.email : null)));
  }

  get currentName$(): Observable<string> {
    return this.currentIdentity$.pipe(map((id) => (id ? id.name : null)));
  }

  get currentUserId$(): Observable<string> {
    return this.currentIdentity$.pipe(
      map((id) => (id ? id.accountIdentifier : null))
    );
  }

  get isLoggedIn$(): Observable<boolean | null> {
    return this.identityProvider.isLoggedIn$;
  }

  get loginInProgress(): boolean {
    return this.identityProvider.loginInProgress();
  }

  get currentUserRoles$(): Observable<any> {
    return this.currentIdentity$.pipe(map((id) => (id ? id.roles : [])));
  }

  get hasSuperAdminPrivilege$(): Observable<boolean> {
    return this.hasPrivileges(RolePermissions.SuperAdmin);
  }

  get hasAdminPrivilege$(): Observable<boolean> {
    return this.hasPrivileges(RolePermissions.Admin);
  }

  private hasPrivileges(rolePermissions: string[]): Observable<boolean> {
    return this.currentUserRoles$.pipe(
      map((roles) => {
        if (roles == undefined) {
          return false;
        }
        if (roles.length > 0) {
          return roles.some((role) => rolePermissions.includes(role));
        } else {
          return false;
        }
      })
    );
  }

  get hasCreatePrivilege$(): Observable<boolean> {
    return this.userInfoState$.pipe(
      map((userInfo) => {
        return userInfo.fetched && userInfo.consumerGroups.length > 0;
      })
    );
  }

  get hasDeletePrivilege$(): Observable<boolean> {
    return this.hasAdminPrivilege$;
  }

  get isLoadingUser(): boolean {
    return false;
  }

  get accessToken(): string {
    return localStorage.getItem("msal.idtoken");
  }

  subscribeCheckAccount(): Subscription {
    // val is on startup of the application null, in this case we do nothing
    return this.isLoggedIn$.pipe(distinctUntilChanged()).subscribe((val) => {
      console.log("Subscribe check account", val, this.loginInProgress);
      if (val === false) {
        console.log("Login ready");
        this.login();
      } else if (val === true) {
        console.log("Redirecting");
        this.redirect();
      }
    });
  }

  redirect() {
    const redirectPathString = window.sessionStorage.getItem("url");
    const queryParamString = window.sessionStorage.getItem("queryParams");

    if (redirectPathString == null && queryParamString == null) {
      this.router.navigate(["resource", "welcome"]);
      return;
    }

    const redirectPath = JSON.parse(redirectPathString);
    const queryParams = JSON.parse(queryParamString);
    this.router.navigate(redirectPath, { queryParams: queryParams });
  }

  login() {
    this.identityProvider.login();
  }

  logout() {
    this.identityProvider.logout();
  }

  cleanup() {
    this.identityProvider.cleanup();
  }
}
