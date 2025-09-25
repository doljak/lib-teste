import { TestBed } from '@angular/core/testing';

import { DoljakLibTestService } from './doljak-lib-to-do-list.service';

describe('DoljakLibTestService', () => {
  let service: DoljakLibTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoljakLibTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
