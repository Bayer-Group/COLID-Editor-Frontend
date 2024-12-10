import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityBaseApiService } from './entity.base.api.service';
import { ResourceTemplateRequestDTO } from 'src/app/shared/models/resource-templates/resource-template-request-dto';
import { ResourceTemplateResultDTO } from 'src/app/shared/models/resource-templates/resource-template-result-dto';
import { ResourceTemplateWriteResultCTO } from 'src/app/shared/models/resource-templates/resource-template-write-result-cto';

@Injectable({
  providedIn: 'root'
})
export class ResourceTemplateApiService extends EntityBaseApiService<
  ResourceTemplateRequestDTO,
  ResourceTemplateResultDTO,
  ResourceTemplateWriteResultCTO
> {
  public controllerRouteSingle = 'resourceTemplate';
  public controllerRoutePlural = 'resourceTemplateList';

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }
}
