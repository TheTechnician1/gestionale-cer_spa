import { TestBed } from '@angular/core/testing';

import { DatiEnergeticiViewService } from './dati-energetici-view.service';

describe('DatiEnergeticiViewService', () => {
  let service: DatiEnergeticiViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatiEnergeticiViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
