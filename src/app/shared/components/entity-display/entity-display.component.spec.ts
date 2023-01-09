import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntityDisplayComponent } from './entity-display.component';

describe('EntityDisplayComponent', () => {
  let component: EntityDisplayComponent;
  let fixture: ComponentFixture<EntityDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
