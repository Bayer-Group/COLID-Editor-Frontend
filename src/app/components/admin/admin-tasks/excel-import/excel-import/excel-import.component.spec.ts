import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelImportComponent } from './excel-import.component';

describe('ExcelImportComponent', () => {
  let component: ExcelImportComponent;
  let fixture: ComponentFixture<ExcelImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
