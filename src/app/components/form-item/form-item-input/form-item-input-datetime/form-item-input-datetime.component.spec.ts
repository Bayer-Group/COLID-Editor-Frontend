import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  DATE_FORMAT,
  FormItemInputDatetimeComponent
} from './form-item-input-datetime.component';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  Pipe,
  PipeTransform
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from '@angular/material/core';
import { FormItemChangedDTO } from 'src/app/shared/models/form/form-item-changed-dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FormItemInputDatetimeComponent', () => {
  let component: FormItemInputDatetimeComponent;
  let fixture: ComponentFixture<FormItemInputDatetimeComponent>;

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
        FormItemInputDatetimeComponent,
        MockFormItemInputBaseComponent,
        MockLastIndexStringPipe
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule
      ],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => FormItemInputDatetimeComponent),
          multi: true
        },
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputDatetimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
