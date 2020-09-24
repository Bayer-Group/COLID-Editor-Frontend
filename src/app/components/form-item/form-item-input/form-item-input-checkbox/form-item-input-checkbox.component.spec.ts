import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputCheckboxComponent } from './form-item-input-checkbox.component';

describe('FormItemInputCheckboxComponent', () => {
  let component: FormItemInputCheckboxComponent;
  let fixture: ComponentFixture<FormItemInputCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemInputCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
