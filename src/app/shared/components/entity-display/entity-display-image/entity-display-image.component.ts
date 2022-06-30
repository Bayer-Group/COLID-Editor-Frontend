import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Entity } from 'src/app/shared/models/Entities/entity';
import { Constants } from 'src/app/shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerDialogComponent } from '../../image-viewer-dialog/image-viewer-dialog.component';


@Component({
  selector: 'app-entity-display-image',
  templateUrl: './entity-display-image.component.html',
  styleUrls: ['./entity-display-image.component.scss']
})
export class EntityDisplayImageComponent implements OnInit {

  @Input() group: string;
  @Input() groupedMetadata: Array<MetaDataProperty>;
  @Input() entity: Entity;
  @Input() headerGroup: string;
  @Input() subHeaderGroup: string;
  @Input() invisbleProperties: Array<string>;

  constants = Constants;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.invisbleProperties) {
      this.groupedMetadata = this.groupedMetadata.filter(g => !this.invisbleProperties.includes(g.key));
    }
  }

  onOpenImageDialog(index: number, entityProperty: any) {
    this.dialog.open(ImageViewerDialogComponent, {
      data: {
        index: index,
        images: entityProperty
      }
    });
  }

  onHoverOverImage(index: number, entityProperty: any) {
    return entityProperty[index]['properties'][Constants.Metadata.Comment];
  }

  get label(): string {
    const metadataProperty = this.groupedMetadata[0];
    const label: string = metadataProperty.properties[Constants.Metadata.Name];

    return label == null ? '' : label;
  }

  get isAttachment(): boolean {
    return this.group === Constants.Resource.Groups.Images;
  }

  get isHeader(): boolean {
    return this.group === this.headerGroup;
  }

  get isSubHeader(): boolean {
    return this.group === this.subHeaderGroup;
  }

  get amountImagesText(): string {
    let amountOfImages = 0;
    for (const metadataProperty of this.groupedMetadata) {
      const entityProperty = this.entity.properties[metadataProperty.key]
      amountOfImages = entityProperty.length;
    }

    if (amountOfImages === 1) {
      return amountOfImages + ' ' + this.label.toLocaleLowerCase();
    }
    return amountOfImages + ' ' + this.label.toLocaleLowerCase() + 's';
  }

}
