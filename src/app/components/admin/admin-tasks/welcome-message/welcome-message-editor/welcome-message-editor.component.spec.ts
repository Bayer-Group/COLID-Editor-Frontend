import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WelcomeMessageEditorComponent } from './welcome-message-editor.component';

describe('WelcomeMessageEditorComponent', () => {
  let component: WelcomeMessageEditorComponent;
  let fixture: ComponentFixture<WelcomeMessageEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeMessageEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeMessageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
