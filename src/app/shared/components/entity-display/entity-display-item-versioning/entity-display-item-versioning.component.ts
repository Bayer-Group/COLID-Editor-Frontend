import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VersionProperty } from 'src/app/shared/models/resources/version-property';

@Component({
  selector: 'app-entity-display-item-versioning',
  templateUrl: './entity-display-item-versioning.component.html',
  styleUrls: ['./entity-display-item-versioning.component.scss']
})
export class EntityDisplayItemVersioningComponent {
  @Input() versions: any[];
  @Input() version: string;

  @Output() versionClick = new EventEmitter<VersionProperty>();

  clickVersion(version: VersionProperty) {
    this.versionClick.emit(version);
  }
}
