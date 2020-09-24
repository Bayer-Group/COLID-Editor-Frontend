import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDisplayItemDistributionComponent } from './resource-display-item-distribution.component';

describe('ResourceDisplayItemDistributionComponent', () => {
  let component: ResourceDisplayItemDistributionComponent;
  let fixture: ComponentFixture<ResourceDisplayItemDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceDisplayItemDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceDisplayItemDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
