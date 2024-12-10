import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDisplayComponent } from './entity-display.component';
import { Component, Input } from '@angular/core';
import { Entity } from '../../models/Entities/entity';
import { MetaDataProperty } from '../../models/metadata/meta-data-property';

describe('EntityDisplayComponent', () => {
  let component: EntityDisplayComponent;
  let fixture: ComponentFixture<EntityDisplayComponent>;

  @Component({
    selector: 'app-entity-display-group',
    template: ''
  })
  class MockEntityDisplayGroupComponent {
    @Input() group: string;
    @Input() groupedMetadata: Array<MetaDataProperty>;
    @Input() entity: Entity;
    @Input() entityVersions: Array<any>;
    @Input() headerGroup: string;
    @Input() subHeaderGroup: string;
    @Input() invisbleProperties: Array<string>;
  }

  @Component({
    selector: 'app-entity-display-image',
    template: ''
  })
  class MockEntityDisplayImageComponent {
    @Input() group: string;
    @Input() groupedMetadata: Array<MetaDataProperty>;
    @Input() entity: Entity;
    @Input() headerGroup: string;
    @Input() subHeaderGroup: string;
    @Input() invisbleProperties: Array<string>;
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
        EntityDisplayComponent,
        MockEntityDisplayGroupComponent,
        MockEntityDisplayImageComponent,
        MockColidSpinnerComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EntityDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
