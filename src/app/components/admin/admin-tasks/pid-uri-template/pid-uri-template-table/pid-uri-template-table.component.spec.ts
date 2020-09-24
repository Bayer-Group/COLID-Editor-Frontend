import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PidUriTemplateTableComponent } from './pid-uri-template-table.component';

describe('PidUriTemplateTableComponent', () => {
  let component: PidUriTemplateTableComponent;
  let fixture: ComponentFixture<PidUriTemplateTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PidUriTemplateTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PidUriTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
