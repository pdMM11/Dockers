import { TestBed } from '@angular/core/testing';

import { PeptideReferencesService } from './peptide-references.service';

describe('PeptideReferencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeptideReferencesService = TestBed.get(PeptideReferencesService);
    expect(service).toBeTruthy();
  });
});
