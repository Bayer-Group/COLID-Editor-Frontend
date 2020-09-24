import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { EntityTypeDto } from 'src/app/shared/models/Entities/entity-type-dto';

@Injectable({
  providedIn: 'root'
})
export class MetaDataApiService {

  constructor(private httpClient: HttpClient) { }

  getMetaData(resourceType: string): Observable<MetaDataProperty[]> {
    const url = environment.colidApiUrl + '/metadata';

    let params = new HttpParams();
    params = params.set('entityType', resourceType);
    return this.httpClient.get<MetaDataProperty[]>(url, { params});
  }

  getMetadataRelease(id: string, resourceType: string): Observable<MetaDataProperty[]> {
    const url = environment.colidApiUrl + '/metadata';

    let params = new HttpParams();
    params = params.append('entityType', resourceType);
    params = params.append('metadataConfig', id);
    return this.httpClient.get<MetaDataProperty[]>(url, { params});
  }

  getResourceTypes(): Observable<EntityTypeDto> {
    return this.httpClient.get<EntityTypeDto>(environment.colidApiUrl + '/metadata/hierarchy');
  }
}
