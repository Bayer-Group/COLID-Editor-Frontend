import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ResourceDisplayItemDropdownComponent } from "./resource-display-item-dropdown.component";

describe("ResourceDisplayItemDropdownComponent", () => {
  let component: ResourceDisplayItemDropdownComponent;
  let fixture: ComponentFixture<ResourceDisplayItemDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceDisplayItemDropdownComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceDisplayItemDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
