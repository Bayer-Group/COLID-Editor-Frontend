import { TestBed } from '@angular/core/testing';

import { AuthConsumerGroupService } from './auth-consumer-group.service';
import { of } from 'rxjs';
import { NgxsModule } from '@ngxs/store';
import { Inject, Injectable } from '@angular/core';
import { IDENT_PROV } from 'src/app/shared/constants';
import { IdentityProvider } from './identity-provider.service';
import { AuthService } from './auth.service';
import { MockIdentityProvider } from './mock-identity-provider.service';

describe('AuthConsumerGroupService', () => {
  let service: AuthConsumerGroupService;

  @Injectable({
    providedIn: 'root'
  })
  class MockAuthService {
    constructor(
      @Inject(IDENT_PROV) private identityProvider: IdentityProvider
    ) {}

    get hasAdminPrivilege$() {
      return of(false);
    }
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot()],
      providers: [
        AuthConsumerGroupService,
        {
          provide: IDENT_PROV,
          useClass: MockIdentityProvider
        },
        {
          provide: AuthService,
          useClass: MockAuthService
        }
      ]
    });

    service = TestBed.inject(AuthConsumerGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
