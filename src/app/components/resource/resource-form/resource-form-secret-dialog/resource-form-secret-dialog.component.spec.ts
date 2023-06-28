import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ResourceFormSecretDialogComponent } from "./resource-form-secret-dialog.component";

describe("ResourceFormSecretDialogComponent", () => {
  let component: ResourceFormSecretDialogComponent;
  let fixture: ComponentFixture<ResourceFormSecretDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceFormSecretDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFormSecretDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
