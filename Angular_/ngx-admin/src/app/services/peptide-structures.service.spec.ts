import { TestBed } from '@angular/core/testing';

import { PeptideStructuresService } from './peptide-structures.service';

describe('PeptideStructuresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeptideStructuresService = TestBed.get(PeptideStructuresService);
    expect(service).toBeTruthy();
  });
});
