import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedUriTemplateDisplayComponent } from './extended-uri-template-display.component';

describe('ExtendedUriTemplateDisplayComponent', () => {
  let component: ExtendedUriTemplateDisplayComponent;
  let fixture: ComponentFixture<ExtendedUriTemplateDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedUriTemplateDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedUriTemplateDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
