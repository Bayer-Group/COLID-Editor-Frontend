import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatusBuildInformationDto } from '../../shared/models/status/status-build-information-dto';
import { RawDeploymentInformationDto } from '../../shared/models/status/raw-deployment-information-dto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatusApiService {
  constructor(private httpClient: HttpClient) {}

  getBuildInformation(): Observable<StatusBuildInformationDto> {
    const url = environment.deploymentInfoUrl;

    return this.httpClient.get<RawDeploymentInformationDto>(url).pipe(
      map((res: RawDeploymentInformationDto) => {
        let editorInformation = res.services['pid-ui'];
        return {
          versionNumber: res.version,
          imageTags: editorInformation.image_tags,
          latestReleaseDate: new Date(
            editorInformation.image_pushed_at_epoch_utc_seconds * 1000
          )
        } as StatusBuildInformationDto;
      })
    );
  }
}
