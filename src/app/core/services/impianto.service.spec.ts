import { TestBed } from '@angular/core/testing';

import { ImpiantoService } from './impianto.service';

describe('ImpiantoService', () => {
  let service: ImpiantoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpiantoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
