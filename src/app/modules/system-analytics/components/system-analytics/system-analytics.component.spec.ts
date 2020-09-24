import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAnalyticsComponent } from './system-analytics.component';

describe('SystemAnalyticsComponent', () => {
  let component: SystemAnalyticsComponent;
  let fixture: ComponentFixture<SystemAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
