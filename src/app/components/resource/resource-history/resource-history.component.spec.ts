import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ResourceHistoryComponent } from "./resource-history.component";

describe("ResourceHistoryComponent", () => {
  let component: ResourceHistoryComponent;
  let fixture: ComponentFixture<ResourceHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceHistoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
