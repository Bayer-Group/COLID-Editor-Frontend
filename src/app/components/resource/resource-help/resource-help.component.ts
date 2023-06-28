import { Component } from "@angular/core";
import { StatusState } from "src/app/state/status.state";
import { StatusBuildInformationDto } from "src/app/shared/models/status/status-build-information-dto";
import { Observable } from "rxjs";
import { Select } from "@ngxs/store";
import { environment } from "src/environments/environment";
import { Constants } from "src/app/shared/constants";

@Component({
  selector: "app-help",
  templateUrl: "./resource-help.component.html",
  styleUrls: ["./resource-help.component.scss"],
})
export class ResourceHelpComponent {
  @Select(StatusState.getBuildInformation)
  buildInformation$: Observable<StatusBuildInformationDto>;

  releaseNotesUrl = environment.releaseNotesUrl;
  imageUrl = Constants.Assets.Logo;

  constructor() {}
}
