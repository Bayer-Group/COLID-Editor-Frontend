import { Component, Output, Input, EventEmitter } from "@angular/core";
import { Entity } from "src/app/shared/models/Entities/entity";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";
import { VersionProperty } from "src/app/shared/models/resources/version-property";
import { Constants } from "../../constants";
import { MetadataExtension } from "../../extensions/metadata.extension";

@Component({
  selector: "app-entity-display",
  templateUrl: "./entity-display.component.html",
  styleUrls: ["./entity-display.component.css"],
})
export class EntityDisplayComponent {
  @Input() editable: boolean = false;
  @Input() entityVersions: Array<VersionProperty>;
  @Input() metadata: Array<MetaDataProperty>;
  @Input() entity: Entity;
  @Input() invisbleProperties: Array<string>;
  @Input() headerGroup: string;
  @Input() subHeaderGroup: string;

  @Output() editEntity: EventEmitter<any> = new EventEmitter<any>();
  @Output() versionClick: EventEmitter<VersionProperty> =
    new EventEmitter<VersionProperty>();

  constructor() {}

  edit() {
    this.editEntity.emit(this.entity);
  }

  versionClicked(event: VersionProperty) {
    this.versionClick.emit(event);
  }

  isVisibleMetadataGroup(key: string) {
    return !MetadataExtension.isInvisbleGroupKey(key);
  }

  isAttachmentGroup(key: string) {
    return key === Constants.Resource.Groups.Images;
  }
}
