import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphManagementComponent } from './graph-management.component';
import { GraphManagementRoutingModule } from './graph-management-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClipboardModule } from 'ngx-clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { GraphUploadDialogComponent } from './components/graph-upload-dialog/graph-upload-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { DndDirective } from './directives/dnd.directive';
import { PrettySizePipe } from './pipes/pretty-size.pipe';
import { GraphFileUploadComponent } from './components/graph-file-upload/graph-file-upload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [GraphManagementComponent, GraphUploadDialogComponent, DndDirective, PrettySizePipe, GraphFileUploadComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ClipboardModule,
    MatDialogModule,
    GraphManagementRoutingModule
  ],
  entryComponents: [GraphUploadDialogComponent]
})
export class GraphManagementModule { }
