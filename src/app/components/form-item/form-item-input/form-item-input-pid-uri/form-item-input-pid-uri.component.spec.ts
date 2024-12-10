import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputPidUriComponent } from './form-item-input-pid-uri.component';
import {
  Component,
  Directive,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Pipe,
  PipeTransform
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormItemChangedDTO } from 'src/app/shared/models/form/form-item-changed-dto';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

describe('FormItemInputPidUriComponent', () => {
  let component: FormItemInputPidUriComponent;
  let fixture: ComponentFixture<FormItemInputPidUriComponent>;

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

  @Directive({
    selector: '[debounce]'
  })
  class MockDebounceDirective {
    @Input('debounce')
    public debounceTime = 500;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormItemInputPidUriComponent,
        MockFormItemInputBaseComponent,
        MockLastIndexStringPipe,
        MockDebounceDirective
      ],
      imports: [
        FontAwesomeTestingModule,
        FormsModule,
        MatButtonModule,
        MatMenuModule
      ],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => FormItemInputPidUriComponent),
          multi: true
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputPidUriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
