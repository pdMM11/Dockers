import { TestBed } from '@angular/core/testing';

import { InhibitorantibodyService } from './inhibitorantibody.service';

describe('InhibitorantibodyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InhibitorantibodyService = TestBed.get(InhibitorantibodyService);
    expect(service).toBeTruthy();
  });
});
