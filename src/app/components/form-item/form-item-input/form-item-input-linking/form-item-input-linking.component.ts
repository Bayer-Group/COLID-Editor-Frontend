import { Component, forwardRef, Input } from '@angular/core';
import { FormItemInputBaseComponent } from '../form-item-input-base/form-item-input-base.component';
import { MatDialog } from '@angular/material/dialog';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ResourceOverviewDTO } from 'src/app/shared/models/resources/resource-overview-dto';
import { DeleteItemDialogComponent } from 'src/app/shared/components/delete-item-dialog/delete-item-dialog.component';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { ResourceSearchDTO } from 'src/app/shared/models/search/resource-search-dto';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';

@Component({
  selector: 'app-form-item-input-linking',
  templateUrl: './form-item-input-linking.component.html',
  styleUrls: ['./form-item-input-linking.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputLinkingComponent),
      multi: true
    }
  ]
})
export class FormItemInputLinkingComponent extends FormItemInputBaseComponent {

  @Input() metaData: MetaDataProperty;
  @Input() label: string;

  displayForm = true;
  fetching = false;

  _linkedEntities: ResourceOverviewDTO[];

  constructor(public dialog: MatDialog, private resourceApiService: ResourceApiService) {
    super();
  }

  get publicValue() {
    return Array.isArray(this.internalValue) ? this.internalValue : [this.internalValue];
  }

  writeValue(value: string | string[]): void {
    if (value != null) {
      this.internalValue = Array.isArray(value) ? value : [value];
      this.createResourceOverviewDTOs(value);
    }
  }

  confirmAndRemoveLinking(linkEntity, index) {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: 'Deleting linking',
        body: `Are you sure you want to delete this linking: <br><br> <strong>PID URI:</strong> ${linkEntity.pidUri}`
      },
      width: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.internalValue = this.internalValue.filter(t => t !== linkEntity.pidUri);
        this._linkedEntities = this._linkedEntities.filter(t => t.pidUri !== linkEntity.pidUri);
        this.handleValueChanged(this.publicValue);
      }
    });
  }

  createResourceOverviewDTOs(pidUris: any): ResourceOverviewDTO[] {
    if (pidUris == null) {
      return [];
    }

    pidUris = Array.isArray(pidUris) ? pidUris : [pidUris];

    const resourceSearch = new ResourceSearchDTO();
    resourceSearch.pidUris = pidUris;
    resourceSearch.limit = pidUris.length;

    this.fetching = true;
    this.resourceApiService.getFilteredResources(resourceSearch).subscribe(
      res => {
        this._linkedEntities = res.items;
        this.fetching = false;
      },
      error => {
        this._linkedEntities = pidUris.map(pidUri => {
          const resourceOverviewDTO = new ResourceOverviewDTO();
          resourceOverviewDTO.pidUri = pidUri;
          return resourceOverviewDTO;
        });
        this.fetching = false;
      });
  }
}
