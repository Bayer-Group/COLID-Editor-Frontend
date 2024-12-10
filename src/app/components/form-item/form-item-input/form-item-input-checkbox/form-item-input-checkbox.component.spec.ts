import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputCheckboxComponent } from './form-item-input-checkbox.component';
import { MatRadioModule } from '@angular/material/radio';

describe('FormItemInputCheckboxComponent', () => {
  let component: FormItemInputCheckboxComponent;
  let fixture: ComponentFixture<FormItemInputCheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputCheckboxComponent],
      imports: [MatRadioModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
