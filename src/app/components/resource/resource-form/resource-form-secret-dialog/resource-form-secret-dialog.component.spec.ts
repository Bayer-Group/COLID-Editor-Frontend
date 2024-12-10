import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFormSecretDialogComponent } from './resource-form-secret-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

describe('ResourceFormSecretDialogComponent', () => {
  let component: ResourceFormSecretDialogComponent;
  let fixture: ComponentFixture<ResourceFormSecretDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceFormSecretDialogComponent],
      imports: [MatButtonModule, MatDialogModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceFormSecretDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
