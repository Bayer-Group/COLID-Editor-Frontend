import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAnalyticsChartComponent } from './system-analytics-chart.component';

describe('SystemAnalyticsChartComponent', () => {
  let component: SystemAnalyticsChartComponent;
  let fixture: ComponentFixture<SystemAnalyticsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemAnalyticsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAnalyticsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
