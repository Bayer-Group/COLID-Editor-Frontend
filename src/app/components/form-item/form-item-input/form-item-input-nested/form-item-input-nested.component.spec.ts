import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputNestedComponent } from './form-item-input-nested.component';

describe('FormItemInputNestedComponent', () => {
  let component: FormItemInputNestedComponent;
  let fixture: ComponentFixture<FormItemInputNestedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemInputNestedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputNestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
