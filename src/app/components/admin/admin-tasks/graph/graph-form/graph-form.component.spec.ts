import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphFormComponent } from './graph-form.component';

describe('GraphFormComponent', () => {
  let component: GraphFormComponent;
  let fixture: ComponentFixture<GraphFormComponent>;

  beforeEach(async(() => {
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
