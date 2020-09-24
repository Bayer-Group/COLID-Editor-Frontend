import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputMultiselectComponent } from './form-item-input-multiselect.component';

describe('FormItemInputMultiselectComponent', () => {
  let component: FormItemInputMultiselectComponent;
  let fixture: ComponentFixture<FormItemInputMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemInputMultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
