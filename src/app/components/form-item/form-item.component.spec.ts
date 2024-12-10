import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormItemComponent } from './form-item.component';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

// TODO: needs proper mock of input data
xdescribe('FormItemComponent', () => {
  let component: FormItemComponent;
  let fixture: ComponentFixture<FormItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemComponent],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => FormItemComponent),
          multi: true
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
