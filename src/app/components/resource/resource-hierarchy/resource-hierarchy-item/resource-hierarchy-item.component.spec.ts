import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourceHierarchyItemComponent } from './resource-hierarchy-item.component';

describe('ResourceHierarchyItemComponent', () => {
  let component: ResourceHierarchyItemComponent;
  let fixture: ComponentFixture<ResourceHierarchyItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceHierarchyItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceHierarchyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
