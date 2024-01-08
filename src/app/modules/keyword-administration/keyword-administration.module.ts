import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { KeywordManagementComponent } from "./keyword-management/keyword-management.component";
import { RouterModule, Routes } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { AppMaterialModule } from "src/app/app-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { KeywordManagementConfirmationDialogComponent } from "./keyword-management-confirmation-dialog/keyword-management-confirmation-dialog.component";
import { SharedModule } from "src/app/shared/shared.module";

const keywordManagmentRoutes = [
  {
    path: "",
    component: KeywordManagementComponent,
  },
];

const routes: Routes = keywordManagmentRoutes;

@NgModule({
  declarations: [
    KeywordManagementComponent,
    KeywordManagementConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class KeywordAdministrationModule {}
