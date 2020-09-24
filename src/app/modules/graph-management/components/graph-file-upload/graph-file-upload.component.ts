import { Component, OnInit, Input, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-graph-file-upload',
  templateUrl: './graph-file-upload.component.html',
  styleUrls: ['./graph-file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: GraphFileUploadComponent,
      multi: true
    }
  ]
})
export class GraphFileUploadComponent implements ControlValueAccessor {

  @ViewChild('fileDropRef', null) fileDropRef: ElementRef;

  onChange: any = () => { };
  onTouched: any = () => { };

  file: File | null = null;

  constructor() {
  }

  writeValue(value: null) {
    // clear file input
    this.fileDropRef.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  /**
 * on file drop handler
 */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  prepareFilesList(files: Array<any>) {
    if (files && files[0]) {
      this.file = files[0];
      this.onChange(this.file);
      this.onTouched();
    }

  }
}
