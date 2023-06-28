import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EntityDisplayImageComponent } from "./entity-display-image.component";

describe("EntityDisplayImageComponent", () => {
  let component: EntityDisplayImageComponent;
  let fixture: ComponentFixture<EntityDisplayImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EntityDisplayImageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDisplayImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
