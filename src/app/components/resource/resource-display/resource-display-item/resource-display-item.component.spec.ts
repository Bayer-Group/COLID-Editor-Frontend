import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDisplayItemComponent } from './resource-display-item.component';

describe('ResourceDisplayItemComponent', () => {
  let component: ResourceDisplayItemComponent;
  let fixture: ComponentFixture<ResourceDisplayItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceDisplayItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceDisplayItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
