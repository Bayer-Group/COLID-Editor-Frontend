import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDisplayItemLinkingComponent } from './resource-display-item-linking.component';

describe('ResourceDisplayItemLinkingComponent', () => {
  let component: ResourceDisplayItemLinkingComponent;
  let fixture: ComponentFixture<ResourceDisplayItemLinkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceDisplayItemLinkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceDisplayItemLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
