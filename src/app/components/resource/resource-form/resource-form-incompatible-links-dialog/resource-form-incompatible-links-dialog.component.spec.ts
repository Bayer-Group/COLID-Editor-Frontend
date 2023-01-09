import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourceFormIncompatibleLinksDialogComponent } from './resource-form-incompatible-links-dialog.component';

describe('ResourceFormIncompatibleLinksDialogComponent', () => {
  let component: ResourceFormIncompatibleLinksDialogComponent;
  let fixture: ComponentFixture<ResourceFormIncompatibleLinksDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceFormIncompatibleLinksDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFormIncompatibleLinksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
