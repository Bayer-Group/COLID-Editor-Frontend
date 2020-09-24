import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerGroupDisplayComponent } from './consumer-group-display.component';

describe('ConsumerGroupDisplayComponent', () => {
  let component: ConsumerGroupDisplayComponent;
  let fixture: ComponentFixture<ConsumerGroupDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerGroupDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerGroupDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
