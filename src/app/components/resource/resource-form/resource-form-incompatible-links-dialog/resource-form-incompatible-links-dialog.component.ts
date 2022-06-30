import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-resource-form-incompatible-links-dialog',
  templateUrl: './resource-form-incompatible-links-dialog.component.html',
  styleUrls: ['./resource-form-incompatible-links-dialog.component.css']
})
export class ResourceFormIncompatibleLinksDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {linkData: LinkData[]}) {
  }

  ngOnInit() {
  }
}

export interface LinkData {
  sourceURI: string;
  targetURI: string;
  type: string;
  targetLabel?: string;
  targetDefinition?: string;
}
