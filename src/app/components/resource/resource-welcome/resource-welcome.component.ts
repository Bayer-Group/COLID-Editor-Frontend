import { Component } from "@angular/core";
import { LogService } from "../../../core/logging/log.service";
import { Select } from "@ngxs/store";
import { WelcomeMessageState } from "src/app/state/welcome-message.state";
import { Observable } from "rxjs";
import { AuthService } from "src/app/modules/authentication/services/auth.service";
import { environment } from "src/environments/environment";
import { WelcomeMessage } from "src/app/shared/models/welcome-message/welcome-message";

@Component({
  selector: "app-resource-welcome",
  templateUrl: "./resource-welcome.component.html",
  styleUrls: ["./resource-welcome.component.scss"],
})
export class ResourceWelcomeComponent {
  @Select(WelcomeMessageState.getWelcomeMessage)
  welcomeMessage$: Observable<WelcomeMessage>;

  constructor(private authService: AuthService, private logger: LogService) {
    this.logger.info("PID_WELCOME_PAGE_OPENED");
  }

  get hasCreatePrivilege$(): Observable<boolean> {
    return this.authService.hasCreatePrivilege$;
  }

  goToDataMarketplace() {
    const url = environment.dmpUrl;
    window.open(url, "_blank");
  }
}
