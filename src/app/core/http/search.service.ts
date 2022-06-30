import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants';
import { EntityTypeDto } from 'src/app/shared/models/Entities/entity-type-dto';
import { ResourceOverviewCTO } from 'src/app/shared/models/resources/resource-overview-cto';
import { ResourceSearchDTO } from 'src/app/shared/models/search/resource-search-dto';
import { SearchHit } from 'src/app/shared/models/search/search-hit';
import { SearchResult } from 'src/app/shared/models/search/search-result';
import { environment } from 'src/environments/environment';
import { ResourceApiService } from './resource.api.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient, private resourceService: ResourceApiService) { }


  search(resourceSearchObject: ResourceSearchDTO, delay:boolean=false, links:boolean=false, resourceLinkTypes: Array<string> = []): Observable<SearchResult> {
    if (!environment.enableIndexSearch ) {
      return this.resourceService.getFilteredResources(resourceSearchObject).pipe(map(res => this.mapOverviewToSearchResult(resourceSearchObject, res)));
    }

    return this.searchInIndexForResources(resourceSearchObject,delay,links,resourceLinkTypes);
  }

  private searchInIndexForResources(resourceSearchObject: ResourceSearchDTO, delay: boolean, links:boolean,resourceLinkTypes: Array<string> = []) : Observable<SearchResult> {
    const url = environment.searchApiUrl + '/search';

    const aggregationFilters = {};
     if(resourceLinkTypes.length > 0 && resourceLinkTypes!= null  && links)
    { 
      aggregationFilters[Constants.Metadata.EntityType] = resourceLinkTypes 
    }


    if (resourceSearchObject.consumerGroup) {
      aggregationFilters[Constants.Metadata.HasConsumerGroup] = [resourceSearchObject.consumerGroup];
    }

    if (resourceSearchObject.lastChangeUser) {
      aggregationFilters[Constants.Metadata.HasLastChangeUser] = [resourceSearchObject.lastChangeUser];
    }

    if (resourceSearchObject.author) {
      aggregationFilters[Constants.Metadata.Author] = [resourceSearchObject.author];
    }

    const status = [];
    if (resourceSearchObject.draft) {
      status.push("Draft")
    }
    if (resourceSearchObject.published) {
      status.push("Published")
    }
    if (resourceSearchObject.markedForDeletion) {
      status.push("Marked for deletion")
    }
    if (status.length !== 0) {
      aggregationFilters[Constants.Metadata.LifeCycleStatus] = status;
    }
    const searchRequestObject = {
      from: resourceSearchObject.offset,
      size: resourceSearchObject.limit,
      searchTerm: resourceSearchObject.searchText == null ? '' : resourceSearchObject.searchText,
      aggregationFilters: aggregationFilters,
      rangeFilters: undefined,
      enableHighlighting: false,
      enableSuggest: false,
      enableAggregation: false,
      "fieldsToReturn": [
        Constants.Metadata.HasLabel,
        Constants.Metadata.HasResourceDefinition,
        Constants.Metadata.EntityType,
        Constants.Metadata.LifeCycleStatus,
        Constants.Metadata.HasPidUri,
        'resourceLinkedLifecycleStatus',
      ],
      searchIndex: 'all',
      order: resourceSearchObject.sequence,
      orderField: resourceSearchObject.orderPredicate,
      apiCallTime: (new Date).toUTCString(), 
      delay: delay
    };
    console.log("searchRequestObject KANWAL",searchRequestObject)

    return this.httpClient.post<SearchResult>(url, searchRequestObject);
  }

  private mapOverviewToSearchResult(resourceSearchObject: ResourceSearchDTO, overviewCto: ResourceOverviewCTO): SearchResult {
    const searchResult = new SearchResult();
    searchResult.originalSearchTerm = resourceSearchObject.searchText;
    searchResult.hits.total = overviewCto.total;
    searchResult.hits.hits = overviewCto.items.map(item => {
      const source = {};
      source[Constants.Metadata.HasLabel] = item.name
      source[Constants.Metadata.HasResourceDefinition] = item.definition
      source[Constants.Metadata.EntityType] = item.resourceType
      source[Constants.Metadata.LifeCycleStatus] = item.lifeCycleStatus
      source[Constants.Metadata.HasPidUri] = item.pidUri
      source['resourceLinkedLifecycleStatus'] = item.publishedVersion != null ? Constants.Resource.LifeCycleStatus.Published : ''

      const searchHit: SearchHit = {
        source,
        id: item.pidUri,
        highlight: {},
        score: 1.0
      }

      return searchHit;
    })
    return searchResult;
  }
}
