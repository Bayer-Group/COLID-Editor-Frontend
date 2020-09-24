import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeMessageFormComponent } from './welcome-message-form.component';

describe('WelcomeMessageFormComponent', () => {
  let component: WelcomeMessageFormComponent;
  let fixture: ComponentFixture<WelcomeMessageFormComponent>;

  beforeEach(async(() => {
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
