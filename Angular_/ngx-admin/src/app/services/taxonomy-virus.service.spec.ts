import { TestBed } from '@angular/core/testing';

import { TaxonomyVirusService } from './taxonomy-virus.service';

describe('TaxonomyVirusService', () => {
  let service: TaxonomyVirusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(TaxonomyVirusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
