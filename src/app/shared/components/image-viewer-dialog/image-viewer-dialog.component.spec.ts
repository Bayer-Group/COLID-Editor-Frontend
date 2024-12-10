import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewerDialogComponent } from './image-viewer-dialog.component';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ImageViewerDialogComponent', () => {
  let component: ImageViewerDialogComponent;
  let fixture: ComponentFixture<ImageViewerDialogComponent>;

  class MockHttpClient {
    get() {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageViewerDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: HttpClient,
          useClass: MockHttpClient
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageViewerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO: need to provide proper input data
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
