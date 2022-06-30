import { Injectable } from '@angular/core';
import { IdentityProvider } from './identity-provider.service';
import { ColidAccount } from '../models/colid-account.model';
import { MsalService, BroadcastService } from '@azure/msal-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { mergeMap, map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AzureIdentityProvider implements IdentityProvider {

  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private msalService: MsalService, private broadcastService: BroadcastService) {
    this.isLoggedIn$.next(this.checkLoggedIn());

    this.broadcastService.subscribe('msal:loginSuccess', res => {
      this.isLoggedIn$.next(this.checkLoggedIn());
    });

    this.broadcastService.subscribe('msal:acquireTokenFailure', res => {
      const loggedIn = this.checkLoggedIn();

      this.isLoggedIn$.next(loggedIn);
      if (!loggedIn) {

        this.login();
      }
    });

  }

  checkLoggedIn(): boolean {
    return this.msalService.getAccount() != null && +(this.msalService.getAccount().idToken).exp > new Date().getSeconds()
  }

  getAccount(): Observable<ColidAccount> {
    return this.isLoggedIn$.pipe(map(isLoggedIn => {
      const azureAccount = this.msalService.getAccount();
      if (!isLoggedIn) {
        return null
      } else {
        const accountRoles: any = azureAccount.idToken.roles;
        return new ColidAccount(azureAccount.name, azureAccount.userName, azureAccount.accountIdentifier, accountRoles)
      }
    }))
  }

  loginInProgress(): boolean {
    return this.msalService.getLoginInProgress();
  }

  login(): void {
    this.msalService.loginRedirect();
  }

  logout(): void {
    this.msalService.logout();
  }
}
