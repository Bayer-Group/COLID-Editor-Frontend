import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceHierarchyComponent } from './resource-hierarchy.component';
import { NgxsModule } from '@ngxs/store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Component, Input } from '@angular/core';
import { EntityTypeDto } from 'src/app/shared/models/Entities/entity-type-dto';

describe('ResourceHierarchyComponent', () => {
  let component: ResourceHierarchyComponent;
  let fixture: ComponentFixture<ResourceHierarchyComponent>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => 'mockValue'
      }
    },
    queryParams: of({ key: 'value' })
  };

  @Component({
    selector: 'app-resource-hierarchy-item',
    template: ''
  })
  class MockResourceHierarchyItemComponent {
    @Input() item: EntityTypeDto;
    @Input() defaultItem: string;
    @Input() creationType: string;
  }

  @Component({
    selector: 'app-colid-spinner',
    template: ''
  })
  class MockColidSpinnerComponent {
    @Input() diameter: number = 100;
    @Input() strokeWidth: number = 5;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceHierarchyComponent,
        MockResourceHierarchyItemComponent,
        MockColidSpinnerComponent
      ],
      imports: [NgxsModule.forRoot([]), RouterModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
