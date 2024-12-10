import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputGeneralComponent } from './form-item-input-general.component';
import { FormsModule } from '@angular/forms';
import { Directive, Input } from '@angular/core';

describe('FormItemInputGeneralComponent', () => {
  let component: FormItemInputGeneralComponent;
  let fixture: ComponentFixture<FormItemInputGeneralComponent>;

  @Directive({
    selector: '[debounce]'
  })
  class MockDebounceDirective {
    @Input('debounce')
    public debounceTime = 500;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputGeneralComponent, MockDebounceDirective],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
