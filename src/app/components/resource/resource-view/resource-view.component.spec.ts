import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceViewComponent } from './resource-view.component';
import { NgxsModule } from '@ngxs/store';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { of } from 'rxjs';
import { LogService } from 'src/app/core/logging/log.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { AuthConsumerGroupService } from 'src/app/modules/authentication/services/auth-consumer-group.service';

// TODO: need proper route mocks
xdescribe('ResourceViewComponent', () => {
  let component: ResourceViewComponent;
  let fixture: ComponentFixture<ResourceViewComponent>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => 'mockValue'
      }
    },
    queryParams: of({ key: 'value' })
  };

  class MockLogService {
    info() {}
    error() {}
  }

  class MockColidMatSnackBarService {}

  class MockAuthService {
    get currentEmail$() {
      return of('test@email');
    }
  }

  class MockAuthConsumerGroupService {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceViewComponent],
      imports: [NgxsModule.forRoot([]), RouterModule, MatDialogModule],
      providers: [
        {
          provide: LogService,
          useClass: MockLogService
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        },
        {
          provide: AuthService,
          useClass: MockAuthService
        },
        {
          provide: AuthConsumerGroupService,
          useClass: MockAuthConsumerGroupService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
