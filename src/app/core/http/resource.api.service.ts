import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResourceRequestDTO } from '../../shared/models/resources/requests/resource-request-dto';
import { ResourceWriteResultCTO } from '../../shared/models/resources/resource-write-result-cto';
import { ResourceSearchDTO } from '../../shared/models/search/resource-search-dto';
import { Entity } from '../../shared/models/Entities/entity';
import { ValidationResultProperty } from '../../shared/models/validation/validation-result-property';
import { Resource } from '../../shared/models/resources/resource';
import { ResourceOverviewCTO } from '../../shared/models/resources/resource-overview-cto';
import {
  HistoricResourceOverviewDTO,
  ResourcRevisionHistory
} from 'src/app/shared/models/resources/historic-resource-overview-dto';
import { Constants } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ResourceApiService {
  constructor(private httpClient: HttpClient) {}

  createLink(
    pidUri: string,
    linkType: string,
    pidUriToLink: string,
    requester: string
  ): Observable<Resource> {
    const url = environment.colidApiUrl + '/resource/addLink';
    let params = new HttpParams();
    params = params.append('pidUri', pidUri);
    params = params.append('linkType', linkType);
    params = params.append('pidUriToLink', pidUriToLink);
    params = params.append('requester', requester);
    return this.httpClient.post<Resource>(url, null, { params });
  }
  removeLink(
    pidUri: string,
    linkType: string,
    pidUriToUnLink: string,
    returnTargetResource: boolean,
    requester: string
  ): Observable<Resource> {
    const url = environment.colidApiUrl + '/resource/removeLink';
    let params = new HttpParams();
    params = params.append('pidUri', pidUri);
    params = params.append('linkType', linkType);
    params = params.append('pidUriToUnLink', pidUriToUnLink);
    params = params.append(
      'returnTargetResource',
      returnTargetResource.toString()
    );
    params = params.append('requester', requester);
    return this.httpClient.post<Resource>(url, null, { params });
  }

  getFilteredResources(
    resourceSearchObject: ResourceSearchDTO
  ): Observable<ResourceOverviewCTO> {
    const url = environment.colidApiUrl + '/resource/search';
    resourceSearchObject.author =
      resourceSearchObject.author == '' ? null : resourceSearchObject.author;
    return this.httpClient.post<ResourceOverviewCTO>(
      url,
      JSON.stringify(resourceSearchObject)
    );
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
    params = params.append(
      'lifecycleStatus',
      Constants.Resource.LifeCycleStatus.Published
    );
    return this.httpClient.get<Resource>(url, { params });
  }

  getResourceHistory(
    resourcePidUri: string
  ): Observable<Array<HistoricResourceOverviewDTO>> {
    const url = environment.colidApiUrl + '/resource/historyList';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    return this.httpClient.get<Array<HistoricResourceOverviewDTO>>(url, {
      params
    });
  }

  getResourceRevisionHistory(
    resourcePidUri: string
  ): Observable<ResourcRevisionHistory[]> {
    const url = environment.colidApiUrl + '/resource/resourcerevisionshistory';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    return this.httpClient.get<ResourcRevisionHistory[]>(url, { params });
  }

  getHistoricResource(id: string, pidUri: string): Observable<Resource> {
    const url = environment.colidApiUrl + '/resource/history';
    let params = new HttpParams();
    params = params.append('pidUri', pidUri);
    params = params.append('id', id);
    return this.httpClient.get<Resource>(url, { params });
  }

  createResource(
    resource: ResourceRequestDTO
  ): Observable<ResourceWriteResultCTO> {
    const url = environment.colidApiUrl + '/resource';
    return this.httpClient.post<ResourceWriteResultCTO>(
      url,
      JSON.stringify(resource)
    );
  }

  editResource(
    resourcePidUri: string,
    resource: ResourceRequestDTO
  ): Observable<ResourceWriteResultCTO> {
    const url = environment.colidApiUrl + '/resource';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    return this.httpClient.put<ResourceWriteResultCTO>(
      url,
      JSON.stringify(resource),
      { params }
    );
  }

  editResourceType(
    resourcePidUri: string,
    resource: ResourceRequestDTO
  ): Observable<ResourceWriteResultCTO> {
    const url = environment.colidApiUrl + '/resource/type';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    return this.httpClient.put<ResourceWriteResultCTO>(
      url,
      JSON.stringify(resource),
      { params }
    );
  }

  publishResource(resourcePidUri: string): Observable<ResourceWriteResultCTO> {
    const url = environment.colidApiUrl + '/resource/publish';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    return this.httpClient.put<ResourceWriteResultCTO>(url, null, { params });
  }

  checkDuplicate(
    duplicateRequest: Entity,
    previousVersion: string
  ): Observable<ValidationResultProperty[]> {
    const url = environment.colidApiUrl + '/identifier/checkForDuplicate';
    if (previousVersion == null) {
      return this.httpClient.post<ValidationResultProperty[]>(
        url,
        JSON.stringify(duplicateRequest)
      );
    }
    let params = new HttpParams();
    params = params.append('previousVersion', previousVersion);
    return this.httpClient.post<ValidationResultProperty[]>(
      url,
      JSON.stringify(duplicateRequest),
      { params }
    );
  }

  deleteResource(resourcePidUri: string, requester: string): Observable<any> {
    const url = environment.colidApiUrl + '/resource';
    let params = new HttpParams();
    params = params.append('pidUri', resourcePidUri);
    params = params.append('requester', requester);
    return this.httpClient.delete(url, { params });
  }

  deleteResources(
    resourcePidUris: string[],
    requester: string
  ): Observable<any> {
    const url = environment.colidApiUrl + '/resource/resourceList';
    let params = new HttpParams();
    params = params.append('requester', requester);

    return this.httpClient.put(url, resourcePidUris, { params });
  }

  markResourceAsDeleted(
    resourcePidUri: string,
    requester: string
  ): Observable<any> {
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
    let params = Object.getOwnPropertyNames(obj).reduce((p, key) => {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((_value) => {
          p = p.append(key, _value);
        });
      } else {
        if (value != null) {
          p = p.set(key, value);
        }
      }
      return p;
    }, new HttpParams());

    console.warn(params);
    return params;
  }

  removeNullProperties(obj: object): object {
    const outParams = {};
    return Object.getOwnPropertyNames(obj).reduce((p, key) => {
      const value = obj[key];
      if (value == null || value == '') {
        outParams[key] = undefined;
      } else {
        outParams[key] = value;
      }
      return outParams;
    }, outParams);
  }

  getResourceHierarchy(
    resourceType: string[]
  ): Observable<Map<string, string[]>> {
    let params = new HttpParams();
    var url = environment.colidApiUrl + '/resource/getResourceHierarchy';
    return this.httpClient.put<Map<string, string[]>>(url, resourceType, {
      params
    });
  }

  getEligibleCollibraDataTypes(): Observable<string[]> {
    const url = `${environment.colidApiUrl}/resource/eligibleCollibraDataTypes`;
    return this.httpClient.get<string[]>(url);
  }

  getPIDURIsForCollibra(): Observable<string[]> {
    const url = `${environment.colidApiUrl}/resource/PIDURIsForCollibra`;
    return this.httpClient.get<string[]>(url);
  }
}
