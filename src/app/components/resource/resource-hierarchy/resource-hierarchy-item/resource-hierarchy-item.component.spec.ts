import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceHierarchyItemComponent } from './resource-hierarchy-item.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { IconTypes } from 'src/app/modules/colid-icons/models/icon-types';

describe('ResourceHierarchyItemComponent', () => {
  let component: ResourceHierarchyItemComponent;
  let fixture: ComponentFixture<ResourceHierarchyItemComponent>;

  @Component({
    selector: 'ds-icon',
    template: ''
  })
  class MockColidIconsComponent {
    @Input() icon: string;
    @Input() delay: number;
    @Input() tooltip: string;
    @Input() tooltipDisabled: boolean = true;
    @Input() iconType: IconTypes = IconTypes.Default;
  }

  @Pipe({
    name: 'removeWhiteSpaces'
  })
  class MockRemoveWhiteSpacesPipe implements PipeTransform {
    transform(value: any): any {
      return value;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceHierarchyItemComponent,
        MockColidIconsComponent,
        MockRemoveWhiteSpacesPipe
      ],
      imports: [FormsModule, MatSelectModule, MatFormFieldModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceHierarchyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
