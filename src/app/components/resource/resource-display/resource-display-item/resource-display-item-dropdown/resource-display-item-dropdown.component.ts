import { Component, OnInit, Input } from '@angular/core';
import { EntityApiService } from 'src/app/core/http/entity.api.service';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Constants } from 'src/app/shared/constants';
import { EntitySearch } from 'src/app/shared/models/Entities/entity-search';
import { BaseEntityResultDTO } from 'src/app/shared/models/Entities/base-entity-result-dto';

@Component({
  selector: 'app-resource-display-item-dropdown',
  templateUrl: './resource-display-item-dropdown.component.html',
  styleUrls: ['./resource-display-item-dropdown.component.css']
})
export class ResourceDisplayItemDropdownComponent implements OnInit {

  @Input() dropdownList: string[];

  @Input() metadata: MetaDataProperty;

  entities: BaseEntityResultDTO[];

  fetched = false;

  badges = false;

  constructor(public entityApiService: EntityApiService) { }

  ngOnInit() {
    const range = this.metadata.properties[Constants.Metadata.Range];

    if (range === 'https://pid.bayer.com/kos/19050/Keyword') {
      this.badges = true;
    }

    const searchObject = new EntitySearch();
    searchObject.Type = range;
    searchObject.Offset = 0;
    searchObject.Limit = 0;
    searchObject.Identifiers = this.dropdownList;


    this.entityApiService.getEntities(searchObject).subscribe(res => {
      this.fetched = true;
      this.entities = res;
    },
    error => this.fetched = true);
  }

}
