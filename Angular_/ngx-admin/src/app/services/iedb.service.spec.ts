import { TestBed } from '@angular/core/testing';

import { IedbService } from './iedb.service';

describe('IedbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IedbService = TestBed.get(IedbService);
    expect(service).toBeTruthy();
  });
});
