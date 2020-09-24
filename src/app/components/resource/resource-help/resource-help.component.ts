import { Component, OnInit } from '@angular/core';
import { StatusState } from 'src/app/state/status.state';
import { BuildInformationDto } from 'src/app/shared/models/status/build-information-dto';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { BUILD } from '../../../../assets/build-variables';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-help',
  templateUrl: './resource-help.component.html',
  styleUrls: ['./resource-help.component.scss']
})
export class ResourceHelpComponent implements OnInit {
  @Select(StatusState.getBuildInformation) buildInformation$: Observable<BuildInformationDto>;
  
  frontendBuildInformation = BUILD;
  releaseNotesUrl = environment.releaseNotesUrl;

  constructor() { }

  ngOnInit() { }
}
