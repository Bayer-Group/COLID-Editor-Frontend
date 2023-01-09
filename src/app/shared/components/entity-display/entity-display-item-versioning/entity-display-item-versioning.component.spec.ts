import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntityDisplayItemVersioningComponent } from './entity-display-item-versioning.component';

describe('EntityDisplayItemVersioningComponent', () => {
  let component: EntityDisplayItemVersioningComponent;
  let fixture: ComponentFixture<EntityDisplayItemVersioningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityDisplayItemVersioningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDisplayItemVersioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
