import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTemplateComponent } from './message-template.component';

describe('MessageTemplateComponent', () => {
  let component: MessageTemplateComponent;
  let fixture: ComponentFixture<MessageTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
