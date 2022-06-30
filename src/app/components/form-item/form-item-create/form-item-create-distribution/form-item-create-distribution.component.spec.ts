import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemCreateDistributionComponent } from './form-item-create-distribution.component';

describe('FormItemCreateDistributionComponent', () => {
  let component: FormItemCreateDistributionComponent;
  let fixture: ComponentFixture<FormItemCreateDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemCreateDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemCreateDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
