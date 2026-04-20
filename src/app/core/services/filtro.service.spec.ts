import { TestBed } from '@angular/core/testing';

import { FiltroService } from './filtro.service';

describe('FiltroService', () => {
  let service: FiltroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the fake list', () => {
    expect(service.getListaElementi().length).toBe(2);
  });

  it('should filter by ragione sociale', () => {
    const risultati = service.filtraElementi({
      ragioneSociale: 'Energia',
      partitaIVA: '',
      formaGiuridica: '',
      stato: '',
      flag: '',
    });

    expect(risultati.length).toBe(1);
    expect(risultati[0].ragioneSociale).toBe('CER Energia Pulita');
  });
});
