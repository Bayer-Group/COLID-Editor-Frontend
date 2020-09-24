import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EntitySearch } from '../../shared/models/Entities/entity-search';
import { environment } from 'src/environments/environment';
import { BaseEntityResultDTO } from '../../shared/models/Entities/base-entity-result-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityApiService {

  constructor(protected httpClient: HttpClient) { }

  getEntities(entitySearch: EntitySearch): Observable<BaseEntityResultDTO[]> {
    const url = `${environment.colidApiUrl}/entityList`;
    const params = this.toHttpParams(entitySearch);
    return this.httpClient.get<BaseEntityResultDTO[]>(url, { params: params });
  }

  getEntityById(id: string): Observable<BaseEntityResultDTO> {
    const url = `${environment.colidApiUrl}/entity`;
    let params = new HttpParams();
    params = params.append('id', id);
    return this.httpClient.get<BaseEntityResultDTO>(url, { params });
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
          p = p.set(key, value);
        }
        return p;
      }, new HttpParams());
  }
}
