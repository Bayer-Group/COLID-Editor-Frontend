import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { MessageTemplateEditComponent } from "./message-template-edit.component";

describe("MessageTemplateEditComponent", () => {
  let component: MessageTemplateEditComponent;
  let fixture: ComponentFixture<MessageTemplateEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MessageTemplateEditComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
