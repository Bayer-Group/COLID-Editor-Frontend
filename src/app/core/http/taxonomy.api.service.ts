import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { TaxonomyResultDTO } from "../../shared/models/taxonomy/taxonomy-result-dto";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TaxonomyService {
  constructor(protected httpClient: HttpClient) {}

  getTaxonomyList(taxonomyType: string): Observable<TaxonomyResultDTO[]> {
    const url = `${environment.colidApiUrl}/taxonomyList`;
    let params = new HttpParams();
    params = params.append("taxonomyType", taxonomyType);
    return this.httpClient.get<TaxonomyResultDTO[]>(url, { params: params });
  }

  getTaxonomyById(id: string): Observable<TaxonomyResultDTO> {
    const url = `${environment.colidApiUrl}/taxonomy`;
    let params = new HttpParams();
    params = params.append("id", id);
    return this.httpClient.get<TaxonomyResultDTO>(url, { params });
  }

  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj).reduce((p, key) => {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((_value) => {
          p = p.append(key, _value);
        });
      } else {
        p = p.set(key, value);
      }
      return p;
    }, new HttpParams());
  }
}
