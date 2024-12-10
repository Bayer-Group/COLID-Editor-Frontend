import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputNumberComponent } from './form-item-input-number.component';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Pipe,
  PipeTransform
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormItemChangedDTO } from 'src/app/shared/models/form/form-item-changed-dto';

describe('FormItemInputNumberComponent', () => {
  let component: FormItemInputNumberComponent;
  let fixture: ComponentFixture<FormItemInputNumberComponent>;

  @Component({
    template: ''
  })
  class MockFormItemInputBaseComponent {
    @Input() name: string;
    @Input() readOnly: boolean;
    @Input() adminPrivilege: boolean;
    @Output() valueChanged: EventEmitter<FormItemChangedDTO> =
      new EventEmitter<FormItemChangedDTO>();
  }

  @Pipe({
    name: 'lastIndexString'
  })
  class MockLastIndexStringPipe implements PipeTransform {
    transform(value: any): any {
      return value;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormItemInputNumberComponent,
        MockFormItemInputBaseComponent,
        MockLastIndexStringPipe
      ],
      imports: [FormsModule],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => FormItemInputNumberComponent),
          multi: true
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
