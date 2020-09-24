import { Component, OnInit, Input } from '@angular/core';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Constants } from 'src/app/shared/constants';
import { Select } from '@ngxs/store';
import { ResourceState } from 'src/app/state/resource.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-resource-display-item-distribution',
  templateUrl: './resource-display-item-distribution.component.html',
  styleUrls: ['./resource-display-item-distribution.component.css']
})
export class ResourceDisplayItemDistributionComponent implements OnInit {
  @Select(ResourceState.getActiveMainDistribution) mainDistribution$: Observable<string>;

  @Input() endpoints: Entity[];
  @Input() metadata: MetaDataProperty;

  constructor() { }

  ngOnInit() {
  }

  getTypeMetadata(properties: { [id: string] : any[]; }) {
    const type = properties[Constants.Metadata.EntityType][0];
    const prop = this.metadata.nestedMetadata.find(r => r.key === type);

    prop.properties = prop.properties.filter(distProp => distProp.properties[Constants.Metadata.HasPidUri] !== Constants.Metadata.EntityType);

    return prop;
  }
}
