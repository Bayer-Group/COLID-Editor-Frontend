import { Inject, Injectable } from '@angular/core';
import { IdentityProvider } from './identity-provider.service';
import { ColidAccount } from '../models/colid-account.model';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';
import {
  EventMessage,
  EventType,
  InteractionStatus
} from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class AzureIdentityProvider implements IdentityProvider {
  isLoggedIn$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean>(
    null
  );
  private readonly _destroying$ = new Subject<void>();
  loggingIn: boolean = false;
  loginDisplay: boolean = false;
  currentStatus: InteractionStatus = InteractionStatus.None;
  constructor(
    @Inject(MsalService) private msalService: MsalService,
    private broadcastService: MsalBroadcastService
  ) {
    //set local variable when login started
    this.broadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.Login
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((_) => (this.loggingIn = true));

    //set local variable when login finished
    this.broadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((_) => {
        this.loggingIn = false;
        this.checkLoggedIn();
      });

    this.broadcastService.inProgress$.subscribe((r) => {
      console.log('current status', r);
      this.currentStatus = r;
    });

    this.broadcastService.msalSubject$
      .pipe(
        filter((ev: EventMessage) => ev.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((_) => {
        console.log('login success', _);
      });
  }

  checkLoggedIn() {
    console.log(
      'checking logged in/azure identity prov',
      this.msalService.instance.getAllAccounts()
    );
    const loggedIn = this.msalService.instance.getAllAccounts().length > 0;
    if (loggedIn) {
      const tokenValid =
        this.msalService.instance.getAllAccounts()[0].idTokenClaims['exp'] >
        new Date().getSeconds();
      this.isLoggedIn$.next(tokenValid);
    } else {
      this.isLoggedIn$.next(false);
    }
  }

  getAccount(): Observable<ColidAccount> {
    let azureAccount: any;
    return this.isLoggedIn$.pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          let activeAccount = this.msalService.instance.getActiveAccount();

          if (
            !activeAccount &&
            this.msalService.instance.getAllAccounts().length > 0
          ) {
            let accounts = this.msalService.instance.getAllAccounts();
            this.msalService.instance.setActiveAccount(accounts[0]);
            azureAccount = accounts[0];
            const accountRoles: any = azureAccount.idTokenClaims['roles'];
            return new ColidAccount(
              azureAccount.name,
              azureAccount.username,
              azureAccount.localAccountId,
              accountRoles
            );
          }

          const accountRoles: any = activeAccount.idTokenClaims['roles'];
          return new ColidAccount(
            activeAccount.name,
            activeAccount.username,
            activeAccount.localAccountId,
            accountRoles
          );
        } else {
          return null;
        }
      })
    );
  }

  loginInProgress(): boolean {
    return this.loggingIn;
  }

  login(): void {
    this.msalService.loginRedirect();
  }

  logout(): void {
    this.msalService.logout();
  }

  cleanup(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}
