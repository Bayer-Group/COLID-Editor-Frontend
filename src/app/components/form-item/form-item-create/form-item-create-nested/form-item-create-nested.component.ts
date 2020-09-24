import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Metadata } from 'src/app/shared/models/metadata/meta-data';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { Constants } from 'src/app/shared/constants';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-form-item-create-nested',
  templateUrl: './form-item-create-nested.component.html',
  styleUrls: ['./form-item-create-nested.component.scss']
})
export class FormItemCreateNestedComponent implements OnInit {

  @Input() selectedPreset: string;
  @Input() label: string;
  @Input() metaData: Metadata[];
  @Input() placeholder: any;

  @Output() createNestedEntity: EventEmitter<Entity> = new EventEmitter<Entity>();

  nestedTypesVisible = false;

  selectedNestedType: Metadata;
  constructor() { }

  ngOnInit() {
  }

  showNestedTypes() {
    this.nestedTypesVisible = true;
  }

  hideNestedTypes() {
    this.selectedNestedType = null;
    this.nestedTypesVisible = false;
  }

  addNestedEntity() {
    const entity = new Entity();
    entity.id = Constants.Resource.Prefix + Guid.create();

    entity.properties[Constants.Metadata.EntityType] = [this.selectedNestedType.key];

    const selectedPreset: Entity[] = this.placeholder[Constants.Metadata.HasPidUri];
    if (selectedPreset != null) {
      entity.properties[Constants.Metadata.HasPidUri] =  Array.isArray(selectedPreset) ? selectedPreset : [selectedPreset];
    }

    this.createNestedEntity.emit(entity);
    this.hideNestedTypes();
  }

}
