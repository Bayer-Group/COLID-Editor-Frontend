import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GraphManagementApiService } from '../../services/graph-management-api.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { NeptuneLoaderStatusReponse } from 'src/app/shared/models/graphs/neptune-loader-status-response';
import { NeptuneLoaderResponse } from 'src/app/shared/models/graphs/neptune-loader-response';

@Component({
  selector: 'app-graph-upload-dialog',
  templateUrl: './graph-upload-dialog.component.html',
  styleUrls: ['./graph-upload-dialog.component.scss']
})
export class GraphUploadDialogComponent implements OnInit {

  file: any;

  submitted: boolean = false;
  status: 'initial' | 'loading' | 'error' | 'graph-upload' | 'success' = 'initial'
  neptuneGraphStatus: NeptuneLoaderStatusReponse;
  loaderId: string;

  loadingStatus = ['LOAD_NOT_STARTED', 'LOAD_IN_PROGRESS', 'LOAD_IN_QUEUE']

  error: string;

  uploadForm: FormGroup = new FormGroup({
    graphName: new FormControl(null, Validators.required),
    graphFile: new FormControl(null, [Validators.required, requiredFileType('ttl')]),
    overwrite: new FormControl(false, Validators.required),
  });

  constructor(private graphService: GraphManagementApiService) { }

  ngOnInit(): void {}

  get isLoading(): boolean {
    return this.status === 'loading'
  }

  get isGraphUpload(): boolean {
    return this.status === 'graph-upload'
  }

  get disabledForm(): boolean {
    return this.isGraphUpload || this.isLoading;
  }

  submit() {
    if (!this.uploadForm.valid) {
      this.uploadForm.markAllAsTouched()
      return;
    }
    this.submitted = true;
    this.status = 'loading';

    let value = this.uploadForm.value;
    this.graphService.uploadGraph(value.graphFile, value.graphName, value.overwrite)
      .subscribe(
        (event: HttpEvent<NeptuneLoaderResponse>) => {
          if (event.type === HttpEventType.Response) {
            this.fetchingStatusInformation(event.body.payload['loadId']);
          }
        },
        error => this.handleReponseError(error));
  }

  fetchingStatusInformation(loaderId: string) {
    this.graphService.getGraphUploadStatus(loaderId).subscribe(
      res => this.handleStatusInformationResponse(res, loaderId),
      error => this.handleReponseError(error));
  }

  handleStatusInformationResponse(response: NeptuneLoaderStatusReponse, loaderId: string) {
    this.neptuneGraphStatus = response;
    this.status = 'graph-upload';
    if (response.loadStatus === 'LOAD_COMPLETED') {
      this.status = 'success'
      this.uploadForm.reset({ overwrite: false })
    } else if (this.loadingStatus.includes(response.loadStatus)) {
      setTimeout(() => this.fetchingStatusInformation(loaderId), 2000);
    } else {
      this.status = 'error';
      this.error = response.loadStatus;
    }
  }

  handleReponseError(error) {
    this.status = 'error';
    this.error = error.error.message;
  }

}

export function requiredFileType(type: string) {
  return function (control: FormControl) {
    const file = control.value;
    if (file) {
      const extension = /(?:\.([^.]+))?$/.exec(file.name)[1].toLowerCase();
      if (type.toLowerCase() !== extension.toLowerCase()) {
        return {
          requiredFileType: true
        };
      }

      return null;
    }

    return null;
  };
}
