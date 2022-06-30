import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { EntityTypeDto } from 'src/app/shared/models/Entities/entity-type-dto';

@Component({
  selector: 'app-resource-hierarchy-item',
  templateUrl: './resource-hierarchy-item.component.html',
  styleUrls: ['./resource-hierarchy-item.component.scss']
})
export class ResourceHierarchyItemComponent implements OnInit {

  @Input() item: EntityTypeDto;
  @Input() defaultItem: string;
  
  constructor() { }

  ngOnInit() {
  }
}
