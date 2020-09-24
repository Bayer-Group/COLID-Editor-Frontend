import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PidUriTemplateComponent } from './pid-uri-template.component';

describe('PidUriTemplateComponent', () => {
  let component: PidUriTemplateComponent;
  let fixture: ComponentFixture<PidUriTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PidUriTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PidUriTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
