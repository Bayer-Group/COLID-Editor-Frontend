import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityHistoricComponent } from './entity-historic.component';
import { Component, Input } from '@angular/core';

describe('EntityHistoricComponent', () => {
  let component: EntityHistoricComponent;
  let fixture: ComponentFixture<EntityHistoricComponent>;

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
      declarations: [EntityHistoricComponent, MockColidSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EntityHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
