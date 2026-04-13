import { TestBed } from '@angular/core/testing';

import { DatiEnergeticiService } from './dati-energetici.service';

describe('DatiEnergeticiService', () => {
  let service: DatiEnergeticiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatiEnergeticiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
