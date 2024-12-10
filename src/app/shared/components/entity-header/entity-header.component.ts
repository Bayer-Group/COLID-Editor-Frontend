import { Component, Input } from '@angular/core';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { Constants } from 'src/app/shared/constants';
import { StringExtension } from '../../extensions/string.extension';

@Component({
  selector: 'app-entity-header',
  templateUrl: './entity-header.component.html',
  styleUrls: ['./entity-header.component.scss']
})
export class EntityHeaderComponent {
  @Input() entity: Entity;
  @Input() key: string;
  @Input() numberSubscribers: number;
  @Input() editMode: boolean;
  @Input() screenWidth: number;

  get label(): string {
    var text = this.entity?.properties[this.key][0];
    return StringExtension.ReplaceHtmlToText(text);
  }

  get iconKey(): string {
    return this.entity?.properties[Constants.Metadata.EntityType][0];
  }

  get className(): string {
    if (!this.editMode) {
      return 'entity-header-text';
    }

    if (this.screenWidth > 1360) {
      return 'entity-header-small';
    } else if (this.screenWidth <= 1360 && this.screenWidth >= 1150) {
      return 'entity-header-smaller';
    } else if (this.screenWidth <= 1150 && this.screenWidth >= 700) {
      return 'entity-header-smallest';
    } else if (this.screenWidth <= 700) {
      return 'entity-header-ultra-smallest';
    }
  }
}
