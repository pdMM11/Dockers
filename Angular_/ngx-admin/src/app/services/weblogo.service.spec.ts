import { TestBed } from '@angular/core/testing';

import { WeblogoService } from './weblogo.service';

describe('WeblogoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeblogoService = TestBed.get(WeblogoService);
    expect(service).toBeTruthy();
  });
});
