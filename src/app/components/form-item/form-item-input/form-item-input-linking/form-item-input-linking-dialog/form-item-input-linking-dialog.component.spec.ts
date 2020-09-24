import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputLinkingDialogComponent } from './form-item-input-linking-dialog.component';

describe('FormItemInputLinkingDialogComponent', () => {
  let component: FormItemInputLinkingDialogComponent;
  let fixture: ComponentFixture<FormItemInputLinkingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemInputLinkingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputLinkingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
