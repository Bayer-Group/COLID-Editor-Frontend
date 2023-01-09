import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormItemInputLinkingComponent } from './form-item-input-linking.component';

describe('FormItemInputLinkingComponent', () => {
  let component: FormItemInputLinkingComponent;
  let fixture: ComponentFixture<FormItemInputLinkingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemInputLinkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
