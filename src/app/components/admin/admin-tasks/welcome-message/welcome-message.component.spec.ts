import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WelcomeMessageComponent } from './welcome-message.component';

describe('WelcomeMessageComponent', () => {
  let component: WelcomeMessageComponent;
  let fixture: ComponentFixture<WelcomeMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
