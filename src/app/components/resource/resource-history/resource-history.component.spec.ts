import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceHistoryComponent } from './resource-history.component';
import { NgxsModule } from '@ngxs/store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';

describe('ResourceHistoryComponent', () => {
  let component: ResourceHistoryComponent;
  let fixture: ComponentFixture<ResourceHistoryComponent>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => 'mockValue'
      }
    },
    queryParams: of({ key: 'value' })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceHistoryComponent],
      imports: [RouterModule, NgxsModule.forRoot([])],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
