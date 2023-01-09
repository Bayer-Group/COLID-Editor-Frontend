import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourceHierarchyComponent } from './resource-hierarchy.component';

describe('ResourceHierarchyComponent', () => {
  let component: ResourceHierarchyComponent;
  let fixture: ComponentFixture<ResourceHierarchyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
