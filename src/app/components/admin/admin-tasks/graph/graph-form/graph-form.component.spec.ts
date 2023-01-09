import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GraphFormComponent } from './graph-form.component';

describe('GraphFormComponent', () => {
  let component: GraphFormComponent;
  let fixture: ComponentFixture<GraphFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
