import { TestBed } from '@angular/core/testing';

import { ProteinService } from './protein.service';

describe('ProteinService', () => {
  let service: ProteinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ProteinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
