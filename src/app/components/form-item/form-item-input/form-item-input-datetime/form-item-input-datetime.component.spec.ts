import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputDatetimeComponent } from './form-item-input-datetime.component';

describe('FormItemInputDatetimeComponent', () => {
  let component: FormItemInputDatetimeComponent;
  let fixture: ComponentFixture<FormItemInputDatetimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemInputDatetimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputDatetimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
