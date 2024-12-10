import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceLockedDialogComponent } from './resource-locked-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('ResourceLockedDialogComponent', () => {
  let component: ResourceLockedDialogComponent;
  let fixture: ComponentFixture<ResourceLockedDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceLockedDialogComponent],
      imports: [MatDialogModule, MatButtonModule, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceLockedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
