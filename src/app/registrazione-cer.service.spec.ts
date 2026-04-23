import { TestBed } from '@angular/core/testing';

import { RegistrazioneCerService } from './registrazione-cer.service';

describe('RegistrazioneCerService', () => {
  let service: RegistrazioneCerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrazioneCerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
