import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDisplayItemComponent } from './entity-display-item.component';
import { NgxsModule } from '@ngxs/store';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';

describe('EntityDisplayItemComponent', () => {
  let component: EntityDisplayItemComponent;
  let fixture: ComponentFixture<EntityDisplayItemComponent>;

  class MockResourceApiService {
    fetchTaxonomy() {}

    fetchLinkedEntries() {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityDisplayItemComponent],
      imports: [NgxsModule.forRoot([])],
      providers: [
        {
          provide: ResourceApiService,
          useClass: MockResourceApiService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EntityDisplayItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
