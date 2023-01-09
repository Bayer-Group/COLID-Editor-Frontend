import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrphanedIdentifierComponent } from './orphaned-identifier.component';

describe('OrphanedIdentifierComponent', () => {
  let component: OrphanedIdentifierComponent;
  let fixture: ComponentFixture<OrphanedIdentifierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrphanedIdentifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrphanedIdentifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
