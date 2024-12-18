import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StatusState } from 'src/app/state/status.state';
import { environment } from 'src/environments/environment';
import { StatusBuildInformationDto } from '../../models/status/status-build-information-dto';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {
  @Select(StatusState.getBuildInformation)
  buildInformation$: Observable<StatusBuildInformationDto>;
  @Input() iconColor: string;

  environmentLabel = environment.Label;
}
