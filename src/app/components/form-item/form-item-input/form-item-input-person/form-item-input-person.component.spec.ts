import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputPersonComponent } from './form-item-input-person.component';

describe('FormItemInputPersonComponent', () => {
  let component: FormItemInputPersonComponent;
  let fixture: ComponentFixture<FormItemInputPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemInputPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
