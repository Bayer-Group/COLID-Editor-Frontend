import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDisplayItemLinkingComponent } from './resource-display-item-linking.component';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';

describe('ResourceDisplayItemLinkingComponent', () => {
  let component: ResourceDisplayItemLinkingComponent;
  let fixture: ComponentFixture<ResourceDisplayItemLinkingComponent>;

  class MockResourceApiService {
    getFilteredResources() {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceDisplayItemLinkingComponent],
      providers: [
        {
          provide: ResourceApiService,
          useClass: MockResourceApiService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceDisplayItemLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
