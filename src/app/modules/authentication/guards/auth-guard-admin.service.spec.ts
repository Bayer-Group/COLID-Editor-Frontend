import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardAdminService } from './auth-guard-admin.service';

describe('AuthGuardAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardAdminService]
    });
  });

  it('should be created', inject([AuthGuardAdminService], (service: AuthGuardAdminService) => {
    expect(service).toBeTruthy();
  }));
});
