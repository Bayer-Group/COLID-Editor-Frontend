import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputTaxonomyComponent } from './form-item-input-taxonomy.component';
import { NgxsModule } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Component, Input } from '@angular/core';
import { TaxonomyResultDTO } from 'src/app/shared/models/taxonomy/taxonomy-result-dto';

describe('FormItemInputTaxonomyComponent', () => {
  let component: FormItemInputTaxonomyComponent;
  let fixture: ComponentFixture<FormItemInputTaxonomyComponent>;

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
      declarations: [
        FormItemInputTaxonomyComponent,
        MockColidTreeViewComponent
      ],
      imports: [NgxsModule.forRoot([]), MatIconModule, MatButtonModule],
      providers: [
        {
          provide: MatDialog,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputTaxonomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
