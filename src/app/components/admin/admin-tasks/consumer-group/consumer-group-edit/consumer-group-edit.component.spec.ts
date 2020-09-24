import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerGroupEditComponent } from './consumer-group-edit.component';

describe('ConsumerGroupEditComponent', () => {
  let component: ConsumerGroupEditComponent;
  let fixture: ComponentFixture<ConsumerGroupEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerGroupEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
