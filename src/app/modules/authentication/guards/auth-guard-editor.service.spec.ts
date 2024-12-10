import { TestBed } from '@angular/core/testing';

import { AuthGuardEditorService } from './auth-guard-editor.service';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';

describe('AuthGuardEditorService', () => {
  class MockAuthService {
    isLoggedIn$ = of(true);
    hasCreatePrivilege$ = of(true);
  }

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [
        AuthGuardEditorService,
        {
          provide: AuthService,
          useClass: MockAuthService
        }
      ]
    })
  );

  it('should be created', () => {
    const service: AuthGuardEditorService = TestBed.get(AuthGuardEditorService);
    expect(service).toBeTruthy();
  });
});
