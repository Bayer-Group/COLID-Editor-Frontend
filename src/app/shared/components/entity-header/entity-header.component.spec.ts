import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityHeaderComponent } from './entity-header.component';
import { Component, Input } from '@angular/core';
import { IconTypes } from 'src/app/modules/colid-icons/models/icon-types';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('EntityHeaderComponent', () => {
  let component: EntityHeaderComponent;
  let fixture: ComponentFixture<EntityHeaderComponent>;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityHeaderComponent, MockColidIconsComponent],
      imports: [MatTooltipModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EntityHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
