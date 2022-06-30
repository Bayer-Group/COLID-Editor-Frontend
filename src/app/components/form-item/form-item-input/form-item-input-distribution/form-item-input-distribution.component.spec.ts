import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemInputDistributionComponent } from './form-item-input-distribution.component';

describe('FormItemInputDistributionComponent', () => {
  let component: FormItemInputDistributionComponent;
  let fixture: ComponentFixture<FormItemInputDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemInputDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
