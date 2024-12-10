import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-resource-form-incompatible-links-dialog',
  templateUrl: './resource-form-incompatible-links-dialog.component.html',
  styleUrls: ['./resource-form-incompatible-links-dialog.component.css']
})
export class ResourceFormIncompatibleLinksDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { linkData: LinkData[] }) {}
}

export interface LinkData {
  sourceURI: string;
  targetURI: string;
  type: string;
  targetLabel?: string;
  targetDefinition?: string;
}
