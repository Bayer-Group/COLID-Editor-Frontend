import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarContentComponent } from './sidebar-content.component';
import { NgxsModule } from '@ngxs/store';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Component, Input } from '@angular/core';
import { SearchHit } from 'src/app/shared/models/search/search-hit';

describe('SidebarContentComponent', () => {
  let component: SidebarContentComponent;
  let fixture: ComponentFixture<SidebarContentComponent>;

  @Component({
    selector: 'app-colid-spinner',
    template: ''
  })
  class MockColidSpinnerComponent {
    @Input() diameter: number = 100;
    @Input() strokeWidth: number = 5;
  }

  @Component({
    selector: 'app-sidebar-content-item',
    template: ''
  })
  class MockSidebarContentItemComponent {
    @Input() hit: SearchHit;
    @Input() selectedResourcePidUri = '';
    @Input() currentPageStatus: string;
    @Input() index: number;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarContentComponent,
        MockColidSpinnerComponent,
        MockSidebarContentItemComponent
      ],
      imports: [
        NgxsModule.forRoot([]),
        MatProgressBarModule,
        MatListModule,
        InfiniteScrollDirective
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
