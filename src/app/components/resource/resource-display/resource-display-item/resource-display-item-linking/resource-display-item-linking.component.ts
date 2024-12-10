import { Component, Input } from '@angular/core';
import { ResourceOverviewDTO } from 'src/app/shared/models/resources/resource-overview-dto';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';
import { ResourceSearchDTO } from 'src/app/shared/models/search/resource-search-dto';

@Component({
  selector: 'app-resource-display-item-linking',
  templateUrl: './resource-display-item-linking.component.html',
  styleUrls: ['./resource-display-item-linking.component.css']
})
export class ResourceDisplayItemLinkingComponent {
  _linkedEntities: ResourceOverviewDTO[];

  @Input() set linkedEntities(pidUris: string[]) {
    this.createResourceOverviewDTOs(pidUris);
  }

  @Input() label: string;

  @Input() displayForm = false;

  fetching = false;

  constructor(private resourceApiService: ResourceApiService) {}

  createResourceOverviewDTOs(pidUris: string[]): ResourceOverviewDTO[] {
    if (pidUris == null) {
      return [];
    }

    pidUris = Array.isArray(pidUris) ? pidUris : [pidUris];

    const resourceSearch = new ResourceSearchDTO();
    resourceSearch.pidUris = pidUris;
    resourceSearch.limit = pidUris.length;
    resourceSearch.published = true;

    this.fetching = true;
    this.resourceApiService.getFilteredResources(resourceSearch).subscribe(
      (res) => {
        this._linkedEntities = res.items;
        this.fetching = false;
      },
      (_) => {
        this._linkedEntities = pidUris.map((pidUri) => {
          const resourceOverviewDTO = new ResourceOverviewDTO();
          resourceOverviewDTO.pidUri = pidUri;
          return resourceOverviewDTO;
        });
        this.fetching = false;
      }
    );
  }
}
