import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ResourceRequestDTO } from '../../shared/models/resources/requests/resource-request-dto';
import { ResourceWriteResultCTO } from '../../shared/models/resources/resource-write-result-cto';
import { ResourceSearchDTO } from '../../shared/models/search/resource-search-dto';
import { Entity } from '../../shared/models/Entities/entity';
import { ValidationResultProperty } from '../../shared/models/validation/validation-result-property';
import { Resource } from '../../shared/models/resources/resource';
import { ResourceOverviewCTO } from '../../shared/models/resources/resource-overview-cto';
import { HistoricResourceOverviewDTO } from 'src/app/shared/models/resources/historic-resource-overview-dto';
import { Constants } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ResourceApiService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getFilteredResources(resourceSearchObject: ResourceSearchDTO): Observable<ResourceOverviewCTO> {
    const url = environment.colidApiUrl + '/resource/search';

    const params = this.toHttpParams(resourceSearchObject);

    return this.httpClient.get<ResourceOverviewCTO>(url, { params: params });
  }

  getResourcesByPidUri(resourcePidUri: string): Observable<Resource> {
    const url = environment.colidApiUrl + '/resource';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    return this.httpClient.get<Resource>(url, { params });
  }

  getPublishedResourcesByPidUri(resourcePidUri: string): Observable<Resource> {
    const url = environment.colidApiUrl + '/resource';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    params = params.append('lifecycleStatus', Constants.Resource.LifeCycleStatus.Published);
    return this.httpClient.get<Resource>(url, { params });
  }

  getResourceHistory(resourcePidUri: string): Observable<Array<HistoricResourceOverviewDTO>> {
    const url = environment.colidApiUrl + '/resource/historyList';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    return this.httpClient.get<Array<HistoricResourceOverviewDTO>>(url, { params });
  }

  getHistoricResource(id: string, pidUri: string): Observable<Resource> {
    const url = environment.colidApiUrl + '/resource/history';
    let params = new HttpParams();
    params = params.append('pidUri', pidUri);
    params = params.append('id', id);
    return this.httpClient.get<Resource>(url, { params });
  }

  createResource(resource: ResourceRequestDTO): Observable<ResourceWriteResultCTO> {
    const url = environment.colidApiUrl + '/resource';
    return this.httpClient.post<ResourceWriteResultCTO>(url, JSON.stringify(resource));
  }

  editResource(resourcePidUri: string, resource: ResourceRequestDTO): Observable<ResourceWriteResultCTO> {
    const url = environment.colidApiUrl + '/resource';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    return this.httpClient.put<ResourceWriteResultCTO>(url, JSON.stringify(resource), { params });
  }

  publishResource(resourcePidUri: string): Observable<ResourceWriteResultCTO> {
    const url = environment.colidApiUrl + '/resource/publish';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    return this.httpClient.put<ResourceWriteResultCTO>(url, null, { params });
  }

  checkDuplicate(duplicateRequest: Entity, previousVersion: string): Observable<ValidationResultProperty[]> {
    const url = environment.colidApiUrl + '/identifier/checkForDuplicate';
    if (previousVersion == null) {
      return this.httpClient.post<ValidationResultProperty[]>(url, JSON.stringify(duplicateRequest));
    }
    let params = new HttpParams();
    params = params.append('previousVersion', previousVersion);
    return this.httpClient.post<ValidationResultProperty[]>(url, JSON.stringify(duplicateRequest), { params });
  }

  deleteResource(resourcePidUri: string): Observable<any> {
    const url = environment.colidApiUrl + '/resource';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    return this.httpClient.delete(url, { params });
  }

  deleteResources(resourcePidUris: string[]): Observable<any> {
    const url = environment.colidApiUrl + '/resource/resourceList';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: resourcePidUris
    };

    return this.httpClient.delete(url, httpOptions);
  }


  markResourceAsDeleted(resourcePidUri: string, requester: string): Observable<any> {
    const url = environment.colidApiUrl + '/resource/markForDeletion';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    params = params.append('requester', requester);

    return this.httpClient.put(url, null, { params });
  }

  rejectResourcesMarkedDeleted(resourcePidUris: string[]): Observable<any> {
    const url = environment.colidApiUrl + '/resource/resourceList/reject';
    return this.httpClient.put(url, resourcePidUris);
  }

  linkResource(pidUri: string, pidUriToLink: string): Observable<string> {
    const url = environment.colidApiUrl + '/resource/version/link';
    let params = new HttpParams();
    params = params.append('currentPidUri', pidUri);
    params = params.append('linkToPidUri', pidUriToLink);

    return this.httpClient.put<string>(url, null, { params });
  }

  unlinkResource(pidUri: string): Observable<string> {
    const url = environment.colidApiUrl + '/resource/version/unlink';
    let params = new HttpParams();
    params = params.append('pidUri', pidUri);
    return this.httpClient.put<string>(url, null, { params });
  }

  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj)
      .reduce((p, key) => {
        const value = obj[key];
        if (Array.isArray(value)) {
          value.forEach(_value => {
            p = p.append(key, _value);
          });
        } else {
          if (value != null) {
            p = p.set(key, value);
          }
        }
        return p;
      }, new HttpParams());
  }
}
