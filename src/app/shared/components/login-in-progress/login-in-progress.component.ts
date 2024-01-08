import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/modules/authentication/services/auth.service";
import { EnsureBrowserSupportService } from "src/app/modules/browser-support/services/ensure-browser-support.service";

@Component({
  selector: "app-login-in-progress",
  templateUrl: "./login-in-progress.component.html",
  styleUrls: ["./login-in-progress.component.css"],
})
export class LoginInProgressComponent implements OnInit, OnDestroy {
  isBrowserSupported = false;
  checkAccountSubscribtion: Subscription;
  constructor(
    private authService: AuthService,
    private browserSupport: EnsureBrowserSupportService
  ) {
    this.isBrowserSupported = browserSupport.isSupported();
  }

  ngOnInit(): void {
    this.checkAccountSubscribtion = this.authService.subscribeCheckAccount();
  }

  ngOnDestroy(): void {
    this.checkAccountSubscribtion.unsubscribe();
  }
}
