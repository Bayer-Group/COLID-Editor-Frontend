import { TestBed } from '@angular/core/testing';

import { PidUriTemplateTableService } from './pid-uri-template-table.service';

describe('PidUriTemplateTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PidUriTemplateTableService = TestBed.get(PidUriTemplateTableService);
    expect(service).toBeTruthy();
  });
});
