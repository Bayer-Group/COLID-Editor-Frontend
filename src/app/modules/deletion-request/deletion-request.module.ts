import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeletionRequestComponent } from './components/deletion-request/deletion-request.component';
import { DeletionRequestRoutingModule } from './deletion-request-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DeletionRequestDialogComponent } from './components/deletion-request-dialog/deletion-request-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ColidIconsModule } from '../colid-icons/colid-icons.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
    declarations: [DeletionRequestComponent, DeletionRequestDialogComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatListModule,
        MatDialogModule,
        MatTooltipModule,
        MatPaginatorModule,
        SharedModule,
        ColidIconsModule.forRoot(),
        DeletionRequestRoutingModule
    ]
})
export class DeletionRequestModule { }
