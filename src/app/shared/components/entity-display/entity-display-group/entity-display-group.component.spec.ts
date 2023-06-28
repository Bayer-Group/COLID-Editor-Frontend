import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EntityDisplayGroupComponent } from "./entity-display-group.component";

describe("EntityDisplayGroupComponent", () => {
  let component: EntityDisplayGroupComponent;
  let fixture: ComponentFixture<EntityDisplayGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EntityDisplayGroupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDisplayGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
