import { Component, OnInit, Input } from '@angular/core';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-entity-header',
  templateUrl: './entity-header.component.html',
  styleUrls: ['./entity-header.component.scss']
})
export class EntityHeaderComponent implements OnInit {

  @Input() entity: Entity;
  @Input() key: string;

  constructor() { }

  ngOnInit() {
  }

  get label(): string {
    return this.entity.properties[this.key][0];
  }

  get iconKey(): string {
    return this.entity.properties[Constants.Metadata.EntityType][0];
  }

}
