import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTreeModule } from '@angular/material/tree';
import { MatDividerModule } from '@angular/material/divider';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Directives
import { DebounceDirective } from './directives/debounce.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';

// Pipes
import { MetadataGroupByPipe } from './pipes/metadata-group-by.pipe';
import { GroupByPipe } from './pipes/group-by.pipe';
import { ColidSpinnerComponent } from './components/colid-spinner/colid-spinner.component';
import { ColidTreeViewComponent } from './components/colid-tree-view/colid-tree-view.component';
import { LoaderComponent } from './components/loader/loader.component';
import { RemoveWhiteSpacesPipe } from './pipes/remove-white-spaces.pipe';
import { LastIndexStringPipe } from './pipes/last-index-string.pipe';


@NgModule({
  declarations: [
    DebounceDirective,
    MetadataGroupByPipe,
    GroupByPipe,
    ColidSpinnerComponent,
    ColidTreeViewComponent,
    ClickOutsideDirective,
    LoaderComponent,
    RemoveWhiteSpacesPipe,
    LastIndexStringPipe
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    MatDividerModule,
    CdkTreeModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    DebounceDirective,
    MetadataGroupByPipe,
    GroupByPipe,
    ColidSpinnerComponent,
    CommonModule,
    ColidTreeViewComponent,
    ClickOutsideDirective,
    RemoveWhiteSpacesPipe,
    LastIndexStringPipe
  ],
  entryComponents: [LoaderComponent]
})
export class SharedModule { }
