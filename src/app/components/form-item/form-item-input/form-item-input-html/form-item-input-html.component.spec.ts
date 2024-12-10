import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputHtmlComponent } from './form-item-input-html.component';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

describe('FormItemInputHtmlComponent', () => {
  let component: FormItemInputHtmlComponent;
  let fixture: ComponentFixture<FormItemInputHtmlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputHtmlComponent],
      imports: [FormsModule, QuillModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemInputHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
