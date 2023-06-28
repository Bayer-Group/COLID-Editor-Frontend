import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ColidTreeViewComponent } from "./colid-tree-view.component";

describe("ColidTreeViewComponent", () => {
  let component: ColidTreeViewComponent;
  let fixture: ComponentFixture<ColidTreeViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ColidTreeViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColidTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
