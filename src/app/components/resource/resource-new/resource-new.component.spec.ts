import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ResourceNewComponent } from "./resource-new.component";

describe("ResourceNewComponent", () => {
  let _component: ResourceNewComponent;
  let fixture: ComponentFixture<ResourceNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceNewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceNewComponent);
    _component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
