import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDisplayItemDropdownComponent } from './resource-display-item-dropdown.component';
import { EntityApiService } from 'src/app/core/http/entity.api.service';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('ResourceDisplayItemDropdownComponent', () => {
  let component: ResourceDisplayItemDropdownComponent;
  let fixture: ComponentFixture<ResourceDisplayItemDropdownComponent>;

  class MockEntityApiService {
    getEntities() {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceDisplayItemDropdownComponent],
      imports: [FontAwesomeTestingModule],
      providers: [{ provide: EntityApiService, useClass: MockEntityApiService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceDisplayItemDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
