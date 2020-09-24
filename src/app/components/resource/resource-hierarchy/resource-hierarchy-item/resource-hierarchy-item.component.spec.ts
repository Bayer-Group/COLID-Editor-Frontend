import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceHierarchyItemComponent } from './resource-hierarchy-item.component';

describe('ResourceHierarchyItemComponent', () => {
  let component: ResourceHierarchyItemComponent;
  let fixture: ComponentFixture<ResourceHierarchyItemComponent>;

  beforeEach(async(() => {
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
