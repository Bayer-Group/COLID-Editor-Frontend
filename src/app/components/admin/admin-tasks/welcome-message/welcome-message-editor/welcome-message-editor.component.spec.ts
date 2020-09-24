import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeMessageEditorComponent } from './welcome-message-editor.component';

describe('WelcomeMessageEditorComponent', () => {
  let component: WelcomeMessageEditorComponent;
  let fixture: ComponentFixture<WelcomeMessageEditorComponent>;

  beforeEach(async(() => {
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
