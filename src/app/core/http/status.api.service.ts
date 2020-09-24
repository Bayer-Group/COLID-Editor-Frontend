import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuildInformationDto } from '../../shared/models/status/build-information-dto';

@Injectable({
  providedIn: 'root'
})
export class StatusApiService {

  constructor(private httpClient: HttpClient) { }

  getBuildInformation(): Observable<BuildInformationDto> {
    const url = environment.colidApiUrl + '/status';

    return this.httpClient.get<BuildInformationDto>(url);
  }
}
