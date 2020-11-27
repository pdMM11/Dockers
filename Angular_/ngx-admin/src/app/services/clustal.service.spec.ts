import { TestBed } from '@angular/core/testing';

import { ClustalService } from './clustal.service';

describe('ClustalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClustalService = TestBed.get(ClustalService);
    expect(service).toBeTruthy();
  });
});
