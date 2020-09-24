import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputHtmlComponent } from './form-item-input-html.component';

describe('FormItemInputHtmlComponent', () => {
  let component: FormItemInputHtmlComponent;
  let fixture: ComponentFixture<FormItemInputHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemInputHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
