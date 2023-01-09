import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntityDisplayItemComponent } from './entity-display-item.component';

describe('EntityDisplayViewItemComponent', () => {
  let component: EntityDisplayItemComponent;
  let fixture: ComponentFixture<EntityDisplayItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityDisplayItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDisplayItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
