import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { NgxsModule } from '@ngxs/store';
import { LogService } from 'src/app/core/logging/log.service';
import { RouterModule } from '@angular/router';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResult } from 'src/app/shared/models/search/search-result';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  class MockLogService {
    info() {}
  }

  @Component({
    selector: 'app-title',
    template: ''
  })
  class MockTitleComponent {
    @Input() iconColor: string;
  }

  @Component({
    selector: 'app-sidebar-filter',
    template: './sidebar-filter.component.html'
  })
  class MockSidebarFilterComponent {
    @Input() searchResultState: Observable<SearchResult>;
  }

  @Component({
    selector: 'app-sidebar-content',
    template: ''
  })
  class MockSidebarContentComponent {
    @Input() selectedResourcePidUri = '';
    @Input() searchResultState: Observable<SearchResult>;
    @Input() loadingState: Observable<boolean>;
    @Input() currentPageStatus: string;
    @Input() resetScrolling: Observable<boolean>;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarComponent,
        MockTitleComponent,
        MockSidebarFilterComponent,
        MockSidebarContentComponent
      ],
      imports: [RouterModule, NgxsModule.forRoot()],
      providers: [
        {
          provide: LogService,
          useClass: MockLogService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
