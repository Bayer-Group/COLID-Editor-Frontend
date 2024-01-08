import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TaxonomyDetailsDialogComponent } from "./taxonomy-details-dialog.component";

describe("TaxonomyDetailsDialogComponent", () => {
  let component: TaxonomyDetailsDialogComponent;
  let fixture: ComponentFixture<TaxonomyDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaxonomyDetailsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxonomyDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
