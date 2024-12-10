import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceHistoricComponent } from './resource-historic.component';
import { Component, Input } from '@angular/core';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';

describe('ResourceHistoricComponent', () => {
  let component: ResourceHistoricComponent;
  let fixture: ComponentFixture<ResourceHistoricComponent>;

  @Component({
    selector: 'app-colid-spinner',
    template: ''
  })
  class MockColidSpinnerComponent {
    @Input() diameter: number = 100;
    @Input() strokeWidth: number = 5;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceHistoricComponent, MockColidSpinnerComponent],
      imports: [MatAccordion, MatExpansionPanel]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
