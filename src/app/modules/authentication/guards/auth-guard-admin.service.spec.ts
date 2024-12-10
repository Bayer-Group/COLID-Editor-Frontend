import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardAdminService } from './auth-guard-admin.service';
import { EMPTY } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';

describe('AuthGuardAdminService', () => {
  class MockAuthService {
    get isLoggedIn$() {
      return EMPTY;
    }

    get hasAdminPrivilege$() {
      return EMPTY;
    }

    get hasSuperAdminPrivilege$() {
      return EMPTY;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [
        AuthGuardAdminService,
        {
          provide: AuthService,
          useClass: MockAuthService
        }
      ]
    });
  });

  it('should be created', inject(
    [AuthGuardAdminService],
    (service: AuthGuardAdminService) => {
      expect(service).toBeTruthy();
    }
  ));
});
