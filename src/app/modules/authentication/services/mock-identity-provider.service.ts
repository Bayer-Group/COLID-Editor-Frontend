import { Injectable } from "@angular/core";
import { IdentityProvider } from "./identity-provider.service";
import { Constants } from "src/app/shared/constants";
import { ColidAccount } from "../models/colid-account.model";
import { BehaviorSubject, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MockIdentityProvider implements IdentityProvider {
  isLoggedIn$: BehaviorSubject<boolean | null> = new BehaviorSubject(null);
  constructor() {
    setTimeout(() => this.isLoggedIn$.next(true), 200);
  }

  getAccount(): Observable<ColidAccount> {
    const idTokenClaimes: any = [
      Constants.Authentication.Roles.SuperAdministration,
      Constants.Authentication.Roles.Administration,
    ];
    return of(
      new ColidAccount(
        "SuperAdmin",
        "superadmin@bayer.com",
        "87654321-4321-4321-4321-210987654321",
        idTokenClaimes
      )
    );
  }

  loginInProgress(): boolean {
    return false;
  }

  login(): Promise<void> {
    return Promise.resolve();
  }

  logout(): void {}

  cleanup(): void {}
}
