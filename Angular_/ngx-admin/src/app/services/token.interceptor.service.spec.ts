import { TestBed } from '@angular/core/testing';

import { Token.InterceptorService } from './token.interceptor.service';

describe('Token.InterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Token.InterceptorService = TestBed.get(Token.InterceptorService);
    expect(service).toBeTruthy();
  });
});
