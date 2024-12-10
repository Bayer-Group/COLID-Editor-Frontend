import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { RouterModule } from '@angular/router';

class MockAuthService {
  isLoggedIn$ = of(true);
}

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [
        AuthGuardService,
        {
          provide: AuthService,
          useClass: MockAuthService
        }
      ]
    });
  });

  it('should be created', inject(
    [AuthGuardService],
    (service: AuthGuardService) => {
      expect(service).toBeTruthy();
    }
  ));
});
