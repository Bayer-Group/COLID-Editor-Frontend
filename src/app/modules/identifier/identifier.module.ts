import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrphanedIdentifierComponent } from "./components/orphaned-identifier/orphaned-identifier.component";
import { IdentifierRoutingModule } from "./identifier-routing.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { MatSortModule } from "@angular/material/sort";
import { NgxsModule } from "@ngxs/store";
import { IdentifierState } from "./identifier.state";
import { IdentifierApiService } from "src/app/core/http/identifier.api.service";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [OrphanedIdentifierComponent],
  imports: [
    CommonModule,
    MatProgressBarModule,
    SharedModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    IdentifierRoutingModule,
    NgxsModule.forFeature([IdentifierState]),
  ],
  providers: [IdentifierApiService],
})
export class IdentifierModule {}
