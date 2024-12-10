import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDisplayItemVersioningComponent } from './entity-display-item-versioning.component';
import { MatChipsModule } from '@angular/material/chips';

// TODO: need to refactor deprecated mat-chip-list -> mat-chip-listbox
xdescribe('EntityDisplayItemVersioningComponent', () => {
  let component: EntityDisplayItemVersioningComponent;
  let fixture: ComponentFixture<EntityDisplayItemVersioningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityDisplayItemVersioningComponent],
      imports: [MatChipsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EntityDisplayItemVersioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
