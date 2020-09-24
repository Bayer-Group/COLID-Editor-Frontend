import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputGeneralMultiComponent } from './form-item-input-general-multi.component';

describe('FormItemInputGeneralMultiComponent', () => {
  let component: FormItemInputGeneralMultiComponent;
  let fixture: ComponentFixture<FormItemInputGeneralMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemInputGeneralMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputGeneralMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
