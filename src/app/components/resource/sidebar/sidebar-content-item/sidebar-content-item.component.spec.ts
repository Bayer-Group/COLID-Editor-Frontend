import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { SidebarContentItemComponent } from "./sidebar-content-item.component";

describe("SidebarContentItemComponent", () => {
  let component: SidebarContentItemComponent;
  let fixture: ComponentFixture<SidebarContentItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarContentItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarContentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
