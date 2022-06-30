import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewerDialogComponent } from './image-viewer-dialog.component';

describe('ImageViewerDialogComponent', () => {
  let component: ImageViewerDialogComponent;
  let fixture: ComponentFixture<ImageViewerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageViewerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
