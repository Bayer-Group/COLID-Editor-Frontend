import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GraphHistoryComponent } from './graph-history.component';

describe('GraphHistoryComponent', () => {
  let component: GraphHistoryComponent;
  let fixture: ComponentFixture<GraphHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
