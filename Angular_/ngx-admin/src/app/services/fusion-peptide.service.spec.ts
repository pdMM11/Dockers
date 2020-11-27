import { TestBed } from '@angular/core/testing';

import { FusionPeptideService } from './fusion-peptide.service';

describe('FusionPeptideService', () => {
  let service: FusionPeptideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(FusionPeptideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
