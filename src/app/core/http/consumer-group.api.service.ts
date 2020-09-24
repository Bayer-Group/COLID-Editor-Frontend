import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConsumerGroupResultDTO } from '../../shared/models/consumerGroups/consumer-group-result-dto';
import { ConsumerGroupRequestDTO } from '../../shared/models/consumerGroups/consumer-group-request-dto';
import { EntityBaseApiService } from './entity.base.api.service';
import { ConsumerGroupWriteResultCTO } from '../../shared/models/consumerGroups/consumer-group-write-result-cto';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConsumerGroupApiService extends EntityBaseApiService<ConsumerGroupRequestDTO, ConsumerGroupResultDTO, ConsumerGroupWriteResultCTO> {

    public controllerRouteSingle = 'consumerGroup';
    public controllerRoutePlural = 'consumerGroupList';

    constructor(protected httpClient: HttpClient) {
        super(httpClient);
    }

    getActiveEntities(): Observable<Array<ConsumerGroupResultDTO>> {
        const url = `${environment.colidApiUrl}/${this.controllerRoutePlural}/active`;
        return this.httpClient.get<ConsumerGroupResultDTO[]>(url);
    }

    reactivateConsumerGroup(identifier: string): Observable<any> {
        const url = `${environment.colidApiUrl}/${this.controllerRouteSingle}`;
        let params = new HttpParams();
        params = params.append('id', identifier);
        return this.httpClient.post(`${url}/reactivate`, null, { params });
    }
}
