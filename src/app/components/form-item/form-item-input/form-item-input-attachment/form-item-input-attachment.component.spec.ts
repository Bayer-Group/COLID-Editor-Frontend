import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputAttachmentComponent } from './form-item-input-attachment.component';

describe('FormItemInputAttachmentComponent', () => {
  let component: FormItemInputAttachmentComponent;
  let fixture: ComponentFixture<FormItemInputAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemInputAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
