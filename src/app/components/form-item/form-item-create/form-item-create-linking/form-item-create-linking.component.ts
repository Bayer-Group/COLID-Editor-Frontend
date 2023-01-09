import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Constants } from 'src/app/shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { FormItemInputLinkingDialogComponent } from '../../form-item-input/form-item-input-linking/form-item-input-linking-dialog/form-item-input-linking-dialog.component';
import { Store } from '@ngxs/store';
import { AddLink } from 'src/app/state/resource.state';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { map } from 'rxjs/operators';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ResourceLockedDialogComponent } from 'src/app/components/resource/resource-dialogs/resource-locked-dialog/resource-locked-dialog.component';
import { FetchLinkResourcesTypesMetadata } from 'src/app/state/meta-data.state';

@Component({
  selector: 'app-form-item-create-linking',
  templateUrl: './form-item-create-linking.component.html',
  styleUrls: ['./form-item-create-linking.component.scss']
})
export class FormItemCreateLinkingComponent implements OnInit {

  constants = Constants;

  pidUriConstant = Constants.Metadata.HasPidUri;

  @Input() disabled: boolean = false;
  @Input() label: string;
  @Input() linkingTypes: MetaDataProperty[];

  @Output() linkingEvent: EventEmitter<any> = new EventEmitter<any>();

  linkingTypesVisible = false;

  selectedLinkingType: MetaDataProperty;

  constructor(private dialog: MatDialog , private store: Store , private authService : AuthService,private snackbar: ColidMatSnackBarService,) { }

  ngOnInit() {
    var linkKeys = this.linkingTypes.map(x=>x.properties[Constants.Shacl.Range]);
    var linkKeys = linkKeys.filter(x=> x!=null);
    this.store.dispatch(new FetchLinkResourcesTypesMetadata(linkKeys))

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
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.currentEmail$.pipe(map(currentEmail$ =>
          this.store.dispatch(new AddLink(this.selectedLinkingType.properties[Constants.Metadata.HasPidUri] , result,currentEmail$))
            )).subscribe(() => {
              //TODO: this.snackbar.success('Resource link added', 'The resource link has been added.');
            }, error => {
              this.handleHttpErrorResponse(error);
            });
        
      }
      this.hideLinkingTypes();
    });
  }
  handleHttpErrorResponse(error: HttpErrorResponse) {
     
    if (error.status === 423) {
      this.handleItemLocked(error);
    }
  }

  handleItemLocked(error: HttpErrorResponse) {
    const dialogRef = this.dialog.open(ResourceLockedDialogComponent, {
      width: 'auto', disableClose: true
    });
  }
}
