import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Metadata } from 'src/app/shared/models/metadata/meta-data';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { Constants } from 'src/app/shared/constants';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-form-item-create-distribution',
  templateUrl: './form-item-create-distribution.component.html',
  styleUrls: ['./form-item-create-distribution.component.scss']
})
export class FormItemCreateDistributionComponent implements OnInit {

  @Input() disabled: boolean = false;
  @Input() selectedPreset: string;
  @Input() label: string;
  @Input() metaData: Metadata[];
  @Input() placeholder: any;

  @Output() createDistributionEntity: EventEmitter<Entity> = new EventEmitter<Entity>();

  distributionTypesVisible = false;

  selectedDistributionType: Metadata;
  constructor() { }

  ngOnInit() {
  }

  showDistributionTypes() {
      this.distributionTypesVisible = true;
  }

  hideDistributionTypes() {
    this.selectedDistributionType = null;
    this.distributionTypesVisible = false;
  }

  addDistributionEntity() {
    const entity = new Entity();
    entity.id = Constants.Resource.Prefix + Guid.create();

    entity.properties[Constants.Metadata.EntityType] = [this.selectedDistributionType.key];

    const selectedPreset: Entity[] = this.placeholder[Constants.Metadata.HasPidUri];
    if (selectedPreset != null) {
      entity.properties[Constants.Metadata.HasPidUri] =  Array.isArray(selectedPreset) ? selectedPreset : [selectedPreset];
    }

    this.createDistributionEntity.emit(entity);
    this.hideDistributionTypes();
  }

}
