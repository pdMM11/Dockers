import { TestBed } from '@angular/core/testing';

import { ProteinReferencesService } from './protein-references.service';

describe('ProteinReferencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProteinReferencesService = TestBed.get(ProteinReferencesService);
    expect(service).toBeTruthy();
  });
});
