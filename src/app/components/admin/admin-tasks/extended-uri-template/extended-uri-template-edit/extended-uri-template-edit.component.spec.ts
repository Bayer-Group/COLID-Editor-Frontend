import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedUriTemplateEditComponent } from './extended-uri-template-edit.component';

describe('ExtendedUriTemplateEditComponent', () => {
  let component: ExtendedUriTemplateEditComponent;
  let fixture: ComponentFixture<ExtendedUriTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedUriTemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedUriTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
