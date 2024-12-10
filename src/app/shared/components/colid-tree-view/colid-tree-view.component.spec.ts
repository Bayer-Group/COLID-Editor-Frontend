import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColidTreeViewComponent } from './colid-tree-view.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

describe('ColidTreeViewComponent', () => {
  let component: ColidTreeViewComponent;
  let fixture: ComponentFixture<ColidTreeViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColidTreeViewComponent],
      imports: [
        MatTreeModule,
        MatCheckboxModule,
        MatDividerModule,
        MatButtonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ColidTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
