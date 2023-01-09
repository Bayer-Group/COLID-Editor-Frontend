import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourceLockedDialogComponent } from './resource-locked-dialog.component';

describe('ResourceLockedDialogComponent', () => {
  let component: ResourceLockedDialogComponent;
  let fixture: ComponentFixture<ResourceLockedDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceLockedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceLockedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
