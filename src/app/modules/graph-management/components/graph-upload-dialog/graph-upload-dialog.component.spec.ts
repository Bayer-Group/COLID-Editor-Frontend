import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphUploadDialogComponent } from './graph-upload-dialog.component';

describe('GraphUploadDialogComponent', () => {
  let component: GraphUploadDialogComponent;
  let fixture: ComponentFixture<GraphUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
