import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Directives
import { DebounceDirective } from "./directives/debounce.directive";
import { ClickOutsideDirective } from "./directives/click-outside.directive";

// Pipes
import { MetadataGroupByPipe } from "./pipes/metadata-group-by.pipe";
import { GroupByPipe } from "./pipes/group-by.pipe";
import { ColidSpinnerComponent } from "./components/colid-spinner/colid-spinner.component";
import { ColidTreeViewComponent } from "./components/colid-tree-view/colid-tree-view.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { RemoveWhiteSpacesPipe } from "./pipes/remove-white-spaces.pipe";
import { LastIndexStringPipe } from "./pipes/last-index-string.pipe";
import { ActionButtonComponent } from "./components/button/action-button/action-button.component";
import { JoinPipe } from "./pipes/join.pipe";
import { MapPipe } from "./pipes/map.pipe";
import { BypassSanitizerPipe } from "./pipes/bypassSanitizer.pipe";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";
import { AppMaterialModule } from "../app-material.module";

@NgModule({
  declarations: [
    DebounceDirective,
    MetadataGroupByPipe,
    GroupByPipe,
    JoinPipe,
    MapPipe,
    BypassSanitizerPipe,
    ColidSpinnerComponent,
    ColidTreeViewComponent,
    ClickOutsideDirective,
    LoaderComponent,
    RemoveWhiteSpacesPipe,
    LastIndexStringPipe,
    ActionButtonComponent,
    ConfirmationDialogComponent,
  ],
  imports: [CommonModule, AppMaterialModule],
  exports: [
    DebounceDirective,
    MetadataGroupByPipe,
    GroupByPipe,
    JoinPipe,
    MapPipe,
    BypassSanitizerPipe,
    ColidSpinnerComponent,
    CommonModule,
    ColidTreeViewComponent,
    ActionButtonComponent,
    ClickOutsideDirective,
    RemoveWhiteSpacesPipe,
    LastIndexStringPipe,
    ConfirmationDialogComponent,
  ],
})
export class SharedModule {}
