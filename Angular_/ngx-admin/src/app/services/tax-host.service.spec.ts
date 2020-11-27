import { TestBed } from '@angular/core/testing';

import { TaxHostService } from './tax-host.service';

describe('TaxHostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaxHostService = TestBed.get(TaxHostService);
    expect(service).toBeTruthy();
  });
});
