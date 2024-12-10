import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomyDetailsDialogComponent } from './taxonomy-details-dialog.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { TaxonomyService } from 'src/app/core/http/taxonomy.api.service';
import { EMPTY } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { Component, Input } from '@angular/core';
import { TaxonomyResultDTO } from 'src/app/shared/models/taxonomy/taxonomy-result-dto';

// TODO: needs deeper investigation to fix -> separate story
xdescribe('TaxonomyDetailsDialogComponent', () => {
  let component: TaxonomyDetailsDialogComponent;
  let fixture: ComponentFixture<TaxonomyDetailsDialogComponent>;

  class MockTaxonomyService {
    searchTaxonomy(term: string) {
      return EMPTY;
    }
  }

  @Component({
    selector: 'colid-tree-view',
    template: ''
  })
  class MockColidTreeViewComponent {
    @Input() singleSelection: boolean = false;
    @Input() TREE_DATA: TaxonomyResultDTO[] = [];
    @Input() taxonomysToExpand: TaxonomyResultDTO[] = [];
    @Input() highlightSelectedNode: boolean = false;
    @Input() set selectedNodes(values: string[]) {}
    @Input() set highlightedTaxonomyDetail(value: TaxonomyResultDTO | null) {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockColidTreeViewComponent],
      imports: [
        AppMaterialModule,
        SharedModule,
        TaxonomyDetailsDialogComponent,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatProgressBarModule,
        MatDividerModule,
        MatDialogModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: TaxonomyService,
          useClass: MockTaxonomyService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaxonomyDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
