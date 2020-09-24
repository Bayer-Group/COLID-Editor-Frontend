import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedUriTemplateComponent } from './extended-uri-template.component';

describe('ExtendedUriTemplateComponent', () => {
  let component: ExtendedUriTemplateComponent;
  let fixture: ComponentFixture<ExtendedUriTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedUriTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedUriTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
