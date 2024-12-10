import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFormIncompatibleLinksDialogComponent } from './resource-form-incompatible-links-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

describe('ResourceFormIncompatibleLinksDialogComponent', () => {
  let component: ResourceFormIncompatibleLinksDialogComponent;
  let fixture: ComponentFixture<ResourceFormIncompatibleLinksDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceFormIncompatibleLinksDialogComponent],
      imports: [MatButtonModule, MatIconModule, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(
      ResourceFormIncompatibleLinksDialogComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
