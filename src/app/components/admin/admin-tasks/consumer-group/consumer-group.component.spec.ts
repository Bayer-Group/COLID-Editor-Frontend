import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsumerGroupComponent } from './consumer-group.component';

describe('ConsumerGroupComponent', () => {
  let component: ConsumerGroupComponent;
  let fixture: ComponentFixture<ConsumerGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
