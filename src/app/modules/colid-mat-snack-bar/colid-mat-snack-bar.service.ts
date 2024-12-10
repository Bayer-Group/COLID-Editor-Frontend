import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColidMatSnackBarComponent } from './colid-mat-snack-bar/colid-mat-snack-bar.component';
import { ColidMatSnackBarData } from './colid-mat-snack-bar-data.model';
import { ColidMatSnackBarType } from './colid-mat-snack-bar-type.model';

@Injectable({
  providedIn: 'root'
})
export class ColidMatSnackBarService {
  constructor(
    private zone: NgZone,
    private snackbar: MatSnackBar
  ) {}

  clear() {
    this.snackbar.dismiss();
  }

  error(
    header: string,
    message: string,
    data: any = null,
    duration: number = 8000
  ) {
    this.openSnackbar(
      header,
      message,
      data,
      'error-snackbar',
      ColidMatSnackBarType.ERROR,
      duration
    );
  }

  warning(
    header: string,
    message: string,
    data: any = null,
    duration: number = 4000
  ) {
    this.openSnackbar(
      header,
      message,
      data,
      'warning-snackbar',
      ColidMatSnackBarType.WARNING,
      duration
    );
  }

  success(
    header: string,
    message: string,
    data: any = null,
    duration: number = 2000
  ) {
    this.openSnackbar(
      header,
      message,
      data,
      'success-snackbar',
      ColidMatSnackBarType.SUCCESS,
      duration
    );
  }

  info(
    header: string,
    message: string,
    data: any = null,
    duration: number = 2000
  ) {
    this.openSnackbar(
      header,
      message,
      data,
      'info-snackbar',
      ColidMatSnackBarType.INFO,
      duration
    );
  }

  private openSnackbar(
    header: string,
    message: string,
    data: any,
    panelClass: string,
    type: ColidMatSnackBarType,
    duration: number = undefined
  ) {
    this.snackbar.openFromComponent(ColidMatSnackBarComponent, {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: [panelClass],
      data: new ColidMatSnackBarData(header, message, data, type)
    });
  }
}
