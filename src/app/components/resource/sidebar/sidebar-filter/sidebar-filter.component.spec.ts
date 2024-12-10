import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFilterComponent } from './sidebar-filter.component';
import { NgxsModule } from '@ngxs/store';
import { LogService } from 'src/app/core/logging/log.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { EMPTY } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SidebarFilterComponent', () => {
  let component: SidebarFilterComponent;
  let fixture: ComponentFixture<SidebarFilterComponent>;

  class MockLogService {
    debug() {}
    info() {}
    warn() {}
    error() {}
  }

  class MockAuthService {
    get currentEmail$() {
      return EMPTY;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarFilterComponent],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot([]),
        MatButtonModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule
      ],
      providers: [
        {
          provide: LogService,
          useClass: MockLogService
        },
        {
          provide: AuthService,
          useClass: MockAuthService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
