import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ResourceHistoricComponent } from "./resource-historic.component";

describe("ResourceHistoricComponent", () => {
  let component: ResourceHistoricComponent;
  let fixture: ComponentFixture<ResourceHistoricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceHistoricComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
