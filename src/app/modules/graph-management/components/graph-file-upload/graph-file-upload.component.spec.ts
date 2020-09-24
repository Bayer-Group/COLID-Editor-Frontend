import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphFileUploadComponent } from './graph-file-upload.component';

describe('GraphFileUploadComponent', () => {
  let component: GraphFileUploadComponent;
  let fixture: ComponentFixture<GraphFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
