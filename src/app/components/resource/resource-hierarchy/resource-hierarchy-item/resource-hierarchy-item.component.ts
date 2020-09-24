import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { EntityTypeDto } from 'src/app/shared/models/Entities/entity-type-dto';

@Component({
  selector: 'app-resource-hierarchy-item',
  templateUrl: './resource-hierarchy-item.component.html',
  styleUrls: ['./resource-hierarchy-item.component.scss']
})
export class ResourceHierarchyItemComponent implements OnInit {

  @Input() item: EntityTypeDto;

  @Input() marginPixel: number;

  @Input() hidden: boolean;

  @Input() activeItem: EntityTypeDto;

  @Output() selectType = new EventEmitter<EntityTypeDto>();

  isLeaf: boolean;

  constructor() { }

  ngOnInit() {
    this.hidden = true;

    this.isLeaf = !!this.item.subClasses.length;
  }

  select() {
    if (this.item.subClasses.length) {
      this.hidden = !this.hidden;
    }
    this.selectType.emit(this.item);
  }

  handleSelectType(item: EntityTypeDto) {
    this.selectType.emit(item);
  }
}
