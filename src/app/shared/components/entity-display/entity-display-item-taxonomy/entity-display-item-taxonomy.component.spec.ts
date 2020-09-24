import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDisplayItemTaxonomyComponent } from './entity-display-item-taxonomy.component';

describe('EntityDisplayItemTaxonomyComponent', () => {
  let component: EntityDisplayItemTaxonomyComponent;
  let fixture: ComponentFixture<EntityDisplayItemTaxonomyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityDisplayItemTaxonomyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDisplayItemTaxonomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
