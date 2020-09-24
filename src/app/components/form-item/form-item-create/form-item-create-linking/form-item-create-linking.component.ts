import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Constants } from 'src/app/shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { FormItemInputLinkingDialogComponent } from '../../form-item-input/form-item-input-linking/form-item-input-linking-dialog/form-item-input-linking-dialog.component';

@Component({
  selector: 'app-form-item-create-linking',
  templateUrl: './form-item-create-linking.component.html',
  styleUrls: ['./form-item-create-linking.component.scss']
})
export class FormItemCreateLinkingComponent implements OnInit {

  constants = Constants;

  pidUriConstant = Constants.Metadata.HasPidUri;

  @Input() label: string;

  @Input() linkingTypes: MetaDataProperty[];

  @Output() linkingEvent: EventEmitter<any> = new EventEmitter<any>();

  linkingTypesVisible = false;

  selectedLinkingType: MetaDataProperty;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  showLinkingTypes() {
    this.linkingTypesVisible = true;
  }

  hideLinkingTypes() {
    this.selectedLinkingType = null;
    this.linkingTypesVisible = false;
  }


  addLinking() {
    const searchType = this.selectedLinkingType.properties[Constants.Shacl.Range];

    const dialogRef = this.dialog.open(FormItemInputLinkingDialogComponent, {
      data: searchType,
      width: '700px',
      height: 'calc(100vh - 200px)',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Emit linkingEvent', result);
        this.linkingEvent.emit({ metadata: this.selectedLinkingType, resource: result});
      }
      this.hideLinkingTypes();
    });
  }
}
