import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceHierarchyComponent } from './resource-hierarchy.component';

describe('ResourceHierarchyComponent', () => {
  let component: ResourceHierarchyComponent;
  let fixture: ComponentFixture<ResourceHierarchyComponent>;

  beforeEach(async(() => {
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
