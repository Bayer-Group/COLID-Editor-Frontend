import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WelcomeMessageFormComponent } from './welcome-message-form.component';

describe('WelcomeMessageFormComponent', () => {
  let component: WelcomeMessageFormComponent;
  let fixture: ComponentFixture<WelcomeMessageFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeMessageFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeMessageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
