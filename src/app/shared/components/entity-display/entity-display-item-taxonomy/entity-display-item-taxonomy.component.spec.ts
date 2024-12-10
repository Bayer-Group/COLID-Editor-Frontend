import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDisplayItemTaxonomyComponent } from './entity-display-item-taxonomy.component';
import { NgxsModule } from '@ngxs/store';

describe('EntityDisplayItemTaxonomyComponent', () => {
  let component: EntityDisplayItemTaxonomyComponent;
  let fixture: ComponentFixture<EntityDisplayItemTaxonomyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityDisplayItemTaxonomyComponent],
      imports: [NgxsModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(EntityDisplayItemTaxonomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
