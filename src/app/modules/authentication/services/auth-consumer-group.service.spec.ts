import { TestBed } from '@angular/core/testing';

import { AuthConsumerGroupService } from './auth-consumer-group.service';

describe('AuthConsumerGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthConsumerGroupService = TestBed.get(AuthConsumerGroupService);
    expect(service).toBeTruthy();
  });
});
