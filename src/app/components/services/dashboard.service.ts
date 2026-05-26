import { Injectable } from '@angular/core';
import { ApiRequestOptions, ApiService } from '../../core/services/api.service';
import { Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private api: ApiService) {}

  public useMock = false;

  private buildSanitizedParams(filtri: any): HttpParams {
    let params = new HttpParams();

    if (!filtri) return params;

    Object.keys(filtri).forEach((key) => {
      const value = filtri[key];

      if (
        value !== null &&
        value !== undefined &&
        value !== 'null' &&
        value !== ''
      ) {
        params = params.set(key, value.toString());
      }
    });

    return params;
  }

  private mockCers = [
    {
      idCer: 2,
      ragSociale: 'TecnoSistemi Avanzati S.p.A.',
      codFisc: 'DLLLCC55A18A369Z',
      comune: 'Roma',
      provincia: 'RM',
      regione: 'Lazio',
      nomeUtente: 'Lucio',
      cognomeUtente: 'Dalla',
      pIva: '01234567890',
      formaGiuridica: 'ASN',
      flgCancellazione: null,
      referente: 'Marco Rossi',
    },
    {
      idCer: 41,
      ragSociale: 'Società Solar',
      codFisc: 'RSSGLI92C41H501U',
      comune: 'Padova',
      provincia: 'PD',
      regione: 'Veneto',
      nomeUtente: 'Giulia',
      cognomeUtente: 'Rossi',
      pIva: '68232317456',
      formaGiuridica: 'ASN',
      flgCancellazione: null,
      referente: 'August',
    },
    {
      idCer: 42,
      ragSociale: 'Energia Verde Campania S.r.l.',
      codFisc: 'TGNNIO97E10Z150S',
      comune: 'Avellino',
      provincia: 'AV',
      regione: 'Campania',
      nomeUtente: 'Michele',
      cognomeUtente: 'Aliffi',
      pIva: '32025869368',
      formaGiuridica: 'FPT',
      flgCancellazione: null,
      referente: 'Giuseppe Romano',
    },
    {
      idCer: 44,
      ragSociale: 'SalumiKm0',
      codFisc: 'HNBLCR68E20Z140Z',
      comune: 'Roma',
      provincia: 'RM',
      regione: 'Lazio',
      nomeUtente: 'Hannibal',
      cognomeUtente: 'Lecter',
      pIva: '48320608145',
      formaGiuridica: 'ASN',
      flgCancellazione: null,
      referente: 'Annibali',
    },
    {
      idCer: 45,
      ragSociale: 'HannyCatering',
      codFisc: 'HKOQTA13S90N355X',
      comune: 'Roma',
      provincia: 'RM',
      regione: 'Lazio',
      nomeUtente: 'Ricardo',
      cognomeUtente: 'Milos',
      pIva: '48320608143',
      formaGiuridica: 'ASN',
      flgCancellazione: null,
      referente: 'Annibalio',
    },
  ];

  getCerById(id: number, options: ApiRequestOptions = {}): Observable<any> {
    if (this.useMock) {
      console.warn(
        `⚠️ DashboardService: Returning MOCK data for CER ID: ${id}`,
      );
      const found = this.mockCers.find((c) => c.idCer === id);
      return of(found ? { ...found } : null);
    }

    const endpoint = `cer/${id}`;
    return this.api.get<any>(endpoint, {}, options);
  }

  getDati(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    if (this.useMock) {
      console.warn('⚠️ DashboardService: Returning MOCK data for CER Table');

      let filtered = [...this.mockCers];
      if (payload.ragSociale) {
        filtered = filtered.filter((c) =>
          c.ragSociale.toLowerCase().includes(payload.ragSociale.toLowerCase()),
        );
      }
      if (payload.codFisc) {
        filtered = filtered.filter((c) =>
          c.codFisc.toLowerCase().includes(payload.codFisc.toLowerCase()),
        );
      }
      return of(filtered);
    }
    const endpoint = 'cer/ricerca';
    return this.api.postLogin<any[]>(endpoint, payload, options);
  }

  getSummary(filtri: any, options: ApiRequestOptions = {}): Observable<any> {
    if (this.useMock) {
      return of({
        totaleComunita: this.mockCers.length,
        totaleImpianti: 12,
        totaleUtenti: 145,
        incentiviErogati: '4.560',
        valoreIncentivi: '25.430',
      });
    }

    const clean = this.getSanitizedFilterObject(filtri);
    return this.api.get<any>('api/dashboard/summary', clean, options);
  }

  getImpiantiPerStato(
    filtri: any,
    options: ApiRequestOptions = {},
  ): Observable<any[]> {
    if (this.useMock)
      return of([
        { stato: 'Attivo', quantita: 8 },
        { stato: 'In Attesa', quantita: 4 },
      ]);
    const clean = this.getSanitizedFilterObject(filtri);
    return this.api.get<any>(
      'api/dashboard/impianti-per-stato',
      clean,
      options,
    );
  }

  getImpiantiPerTipologia(
    filtri: any,
    options: ApiRequestOptions = {},
  ): Observable<any[]> {
    if (this.useMock)
      return of([
        { tipologia: 'Fotovoltaico', valore: 10 },
        { tipologia: 'Eolico', valore: 2 },
      ]);
    const clean = this.getSanitizedFilterObject(filtri);
    return this.api.get<any>(
      'api/dashboard/impianti-per-tipologia',
      clean,
      options,
    );
  }

  getAndamentoEnergetico(
    filtri: any,
    options: ApiRequestOptions = {},
  ): Observable<any[]> {
    if (this.useMock) return of([]);
    const clean = this.getSanitizedFilterObject(filtri);
    return this.api.get<any>(
      'api/dashboard/andamento-energetico',
      clean,
      options,
    );
  }

  getTopCer(filtri: any, options: ApiRequestOptions = {}): Observable<any[]> {
    if (this.useMock)
      return of([
        {
          ragSociale: 'TecnoSistemi Avanzati S.p.A.',
          energiaCondivisa: '1.200 kWh',
          incentivi: '450 €',
        },
        {
          ragSociale: 'SalumiKm0',
          energiaCondivisa: '980 kWh',
          incentivi: '320 €',
        },
      ]);
    const clean = this.getSanitizedFilterObject(filtri);
    return this.api.get<any>('api/dashboard/top-cer', clean, options);
  }

  getAlert(filtri: any, options: ApiRequestOptions = {}): Observable<any[]> {
    if (this.useMock)
      return of([{ tipo: 'Critico', descrizione: 'Impianto ID 42 offline' }]);
    const clean = this.getSanitizedFilterObject(filtri);
    return this.api.get<any>('api/dashboard/alert', clean, options);
  }

  disattivaCer(deleteDto: {
    idCer: number;
    emailUtenteLoggato: string;
  }): Observable<string> {
    if (this.useMock) {
      console.warn(
        `[MOCK ACTIVATED] Simulating logical deletion for CER ID: ${deleteDto.idCer}`,
      );

      this.mockCers = this.mockCers.filter(
        (item) => item.idCer !== deleteDto.idCer,
      );

      return of('Record disattivato con successo (MOCK MODE)');
    }

    const endpoint = 'cer/cancellazione';
    const options: any = {
      responseType: 'text',
    };

    return this.api.put<string>(endpoint, deleteDto, options);
  }

  private getSanitizedFilterObject(
    filtri: any,
  ): Record<string, string | number | boolean> {
    const cleanFiltri: Record<string, string | number | boolean> = {};

    if (filtri) {
      Object.keys(filtri).forEach((key) => {
        const value = filtri[key];
        if (
          value !== null &&
          value !== undefined &&
          value !== 'null' &&
          value !== ''
        ) {
          cleanFiltri[key] = value;
        }
      });
    }

    return cleanFiltri;
  }

  modificaCer(
    updatedData: any,
    options: ApiRequestOptions = {},
  ): Observable<any> {
    if (this.useMock) {
      console.warn(
        `[MOCK ACTIVATED] Simulating update for CER ID: ${updatedData.idCer}`,
      );

      const index = this.mockCers.findIndex(
        (c) => c.idCer === updatedData.idCer,
      );
      if (index !== -1) {
        this.mockCers[index] = { ...this.mockCers[index], ...updatedData };
      }
      return of({
        status: 'success',
        message: 'Record aggiornato con successo (MOCK MODE)',
      });
    }

    const endpoint = 'cer';
    return this.api.put<any>(endpoint, updatedData, options);
  }
}
