import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignUserComponent } from './assign-user.component';

describe('AssignUserComponent', () => {
  let component: AssignUserComponent;
  let fixture: ComponentFixture<AssignUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
