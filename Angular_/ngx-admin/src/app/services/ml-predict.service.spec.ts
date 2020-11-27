import { TestBed } from '@angular/core/testing';

import { MlPredictService } from './ml-predict.service';

describe('MlPredictService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MlPredictService = TestBed.get(MlPredictService);
    expect(service).toBeTruthy();
  });
});
