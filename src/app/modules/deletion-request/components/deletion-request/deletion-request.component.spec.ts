import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletionRequestComponent } from './deletion-request.component';

describe('DeletionRequestComponent', () => {
  let component: DeletionRequestComponent;
  let fixture: ComponentFixture<DeletionRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletionRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
