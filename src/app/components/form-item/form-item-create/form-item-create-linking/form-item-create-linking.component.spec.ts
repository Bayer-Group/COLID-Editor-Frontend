import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormItemCreateLinkingComponent } from './form-item-create-linking.component';

describe('FormItemCreateLinkingComponent', () => {
  let component: FormItemCreateLinkingComponent;
  let fixture: ComponentFixture<FormItemCreateLinkingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormItemCreateLinkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemCreateLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
