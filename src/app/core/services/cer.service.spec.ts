import { TestBed } from '@angular/core/testing';

import { CERService } from './cer.service';

describe('CERService', () => {
  let service: CERService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CERService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
