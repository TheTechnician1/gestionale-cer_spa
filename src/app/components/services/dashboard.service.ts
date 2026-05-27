import { Injectable } from '@angular/core';
import { ApiRequestOptions, ApiService } from '../../core/services/api.service';
import { map, Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  summaryMetrics = [
    {
      label: 'N. COMUNITÀ ENERGETICHE',
      value: '234',
      sub: 'Totale comunità registrate',
      icon: 'groups',
      color: 'blue',
    },
    {
      label: 'N. IMPIANTI',
      value: '657',
      sub: 'Totale impianti attivi',
      icon: 'bolt',
      color: 'green',
    },
    {
      label: 'N. UTENTI',
      value: '3.428',
      sub: 'Totale utenti coinvolti',
      icon: 'person',
      color: 'purple',
    },
    {
      label: 'N. INCENTIVI EROGATI',
      value: '124.567',
      sub: 'Totale incentivi distribuiti (€)',
      icon: 'euro',
      color: 'amber',
    },
    {
      label: 'N. VALORE INCENTIVI',
      value: '785.234.248 €',
      sub: 'Valore economico totale',
      icon: 'account_balance_wallet',
      color: 'cyan',
    },
  ];

  statoAttivitaData = [
    { name: 'Attive', count: 112, percentage: '47.9%', color: '#10b981' },
    {
      name: 'In Costruzione',
      count: 57,
      percentage: '24.4%',
      color: '#3b82f6',
    },
    {
      name: 'In Attesa di Costituirsi',
      count: 41,
      percentage: '17.5%',
      color: '#f59e0b',
    },
    { name: 'Sospese', count: 24, percentage: '10.3%', color: '#ef4444' },
  ];

  topComuni = [
    { nome: 'Roma', conteggio: 18, icona: '🏛️' },
    { nome: 'Milano', conteggio: 15, icona: '🏢' },
    { nome: 'Torino', conteggio: 12, icona: '🚗' },
    { nome: 'Bologna', conteggio: 9, icona: '🎓' },
    { nome: 'Firenze', conteggio: 8, icona: '🎨' },
  ];

  topRegioni = [
    { nome: 'Lombardia', conteggio: 48, icona: '🟢' },
    { nome: 'Lazio', conteggio: 36, icona: '🔵' },
    { nome: 'Emilia-Romagna', conteggio: 28, icona: '🔴' },
    { nome: 'Veneto', conteggio: 22, icona: '🦁' },
    { nome: 'Piemonte', conteggio: 18, icona: '🏔️' },
  ];
  constructor(private api: ApiService) {}

  public useMock = true;

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

  private mockCers: any[] = [
    {
      idCer: 2,
      ragioneSociale: 'TecnoSistemi Avanzati S.p.A.',
      codiceFiscale: 'DLLLCC55A18A369Z',
      partitaIva: '01234567890',
      email: 'info@tecnosistemi.it',
      pec: 'amministrazione@pec.tecnosistemi.it',
      sitoWeb: null,
      referente: 'Marco Rossi',
      telefono: null,
      flgCancellazione: 'N',
      nomeUtente: 'Lucio',
      cognomeUtente: 'Dalla',
      formaGiuridica: {
        codice: 'ASN',
        descrizione: 'ASN - Associazione non riconosciuta',
        specifica: null,
      },
      comuneLegale: {
        codice: '9913',
        descrizione: 'MILANO',
        specifica: null,
      },
      provinciaLegale: {
        codice: 'MI',
        descrizione: 'Milano',
        specifica: null,
      },
      regioneLegale: {
        codice: '030',
        descrizione: 'Lombardia',
        specifica: null,
      },
    },
    {
      idCer: 41,
      ragioneSociale: 'Società solar',
      codiceFiscale: 'RSSGLI92C41H501U',
      partitaIva: '68232317456',
      email: 'info@societasolar.it',
      pec: 'societasolar@pec.it',
      sitoWeb: null,
      referente: 'August',
      telefono: null,
      flgCancellazione: 'N',
      nomeUtente: 'Giulia',
      cognomeUtente: 'Rossi',
      formaGiuridica: {
        codice: 'ASN',
        descrizione: 'ASN - Associazione non riconosciuta',
        specifica: null,
      },
      comuneLegale: {
        codice: '1',
        descrizione: 'PADOVA',
        specifica: null,
      },
      provinciaLegale: {
        codice: 'PD',
        descrizione: 'Padova',
        specifica: null,
      },
      regioneLegale: {
        codice: '050',
        descrizione: 'Veneto',
        specifica: null,
      },
    },
    {
      idCer: 42,
      ragioneSociale: 'Energia Verde Campania S.r.l.',
      codiceFiscale: 'TGNNIO97E10Z150S',
      partitaIva: '32025869368',
      email: 'contatti@energiaverdecampania.it',
      pec: 'energiaverdecampania@legalmail.it',
      sitoWeb: null,
      referente: 'Giuseppe Romano',
      telefono: null,
      flgCancellazione: 'N',
      nomeUtente: 'Michele',
      cognomeUtente: 'Aliffi',
      formaGiuridica: {
        codice: 'FPT',
        descrizione: 'FPT - Forma Privata Tipica',
        specifica: null,
      },
      comuneLegale: {
        codice: '10050',
        descrizione: 'AVELLINO',
        specifica: null,
      },
      provinciaLegale: {
        codice: 'AV',
        descrizione: 'Avellino',
        specifica: null,
      },
      regioneLegale: {
        codice: '150',
        descrizione: 'Campania',
        specifica: null,
      },
    },
    {
      idCer: 44,
      ragioneSociale: 'SalumiKm0',
      codiceFiscale: 'HNBLCR68E20Z140Z',
      partitaIva: '48320608145',
      email: 'ordini@salumikm0.it',
      pec: 'salumikm0@pec.it',
      sitoWeb: null,
      referente: 'Annibali',
      telefono: null,
      flgCancellazione: 'N',
      nomeUtente: 'Hannibal',
      cognomeUtente: 'Lecter',
      formaGiuridica: {
        codice: 'ASN',
        descrizione: 'ASN - Associazione non riconosciuta',
        specifica: null,
      },
      comuneLegale: {
        codice: '4417',
        descrizione: 'ROMA',
        specifica: null,
      },
      provinciaLegale: {
        codice: 'RM',
        descrizione: 'Roma',
        specifica: null,
      },
      regioneLegale: {
        codice: '120',
        descrizione: 'Lazio',
        specifica: null,
      },
    },
    {
      idCer: 45,
      ragioneSociale: 'HannyCatering',
      codiceFiscale: 'HKOQTA13S90N355X',
      partitaIva: '48320608143',
      email: 'eventi@hannycatering.it',
      pec: 'hannycatering@pec.it',
      sitoWeb: null,
      referente: 'Annibalio',
      telefono: null,
      flgCancellazione: 'N',
      nomeUtente: 'Ricardo',
      cognomeUtente: 'Milos',
      formaGiuridica: {
        codice: 'ASN',
        descrizione: 'ASN - Associazione non riconosciuta',
        specifica: null,
      },
      comuneLegale: {
        codice: '4417',
        descrizione: 'ROMA',
        specifica: null,
      },
      provinciaLegale: {
        codice: 'RM',
        descrizione: 'Roma',
        specifica: null,
      },
      regioneLegale: {
        codice: '120',
        descrizione: 'Lazio',
        specifica: null,
      },
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

    const endpoint = `cer/visualizzazione/${id}`;

    return this.api.get<any[]>(endpoint, {}, options).pipe(
      map((list) => {
        return list && list.length > 0 ? list[0] : null;
      }),
    );
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
    return of({
      totaleComunita: this.mockCers.length,
      totaleImpianti: 12,
      totaleUtenti: 145,
      incentiviErogati: '4.560',
      valoreIncentivi: '25.430',
    });
  }

  getImpiantiPerStato(
    filtri: any,
    options: ApiRequestOptions = {},
  ): Observable<any[]> {
    return of([
      { stato: 'Attivo', quantita: 8 },
      { stato: 'In Attesa', quantita: 4 },
    ]);
  }

  getImpiantiPerTipologia(
    filtri: any,
    options: ApiRequestOptions = {},
  ): Observable<any[]> {
    return of([
      { tipologia: 'Fotovoltaico', valore: 10 },
      { tipologia: 'Eolico', valore: 2 },
    ]);
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
    updatedCer: any,
    options: ApiRequestOptions = {},
  ): Observable<any> {
    if (this.useMock) {
      const index = this.mockCers.findIndex(
        (item) => item.idCer === updatedCer.idCer,
      );

      if (index !== -1) {
        this.mockCers[index] = {
          ...this.mockCers[index],
          ragioneSociale: updatedCer.ragSociale,
          codiceFiscale: updatedCer.codFiscale,
          partitaIva: updatedCer.getpIva,
          referente: updatedCer.referente,

          formaGiuridica:
            typeof updatedCer.formaGiuridica === 'object'
              ? updatedCer.formaGiuridica
              : {
                  codice: this.mockCers[index].formaGiuridica?.codice || 'ASN',
                  descrizione: updatedCer.formaGiuridica,
                  specifica: null,
                },
          comuneLegale:
            typeof updatedCer.comuneLegale === 'object'
              ? updatedCer.comuneLegale
              : {
                  codice: this.mockCers[index].comuneLegale?.codice || '',
                  descrizione: updatedCer.comune,
                  specifica: null,
                },
          provinciaLegale:
            typeof updatedCer.provinciaLegale === 'object'
              ? updatedCer.provinciaLegale
              : {
                  codice: this.mockCers[index].provinciaLegale?.codice || '',
                  descrizione: updatedCer.provincia,
                  specifica: null,
                },
          regioneLegale:
            typeof updatedCer.regioneLegale === 'object'
              ? updatedCer.regioneLegale
              : {
                  codice: this.mockCers[index].regioneLegale?.codice || '',
                  descrizione: updatedCer.regione,
                  specifica: null,
                },
        };

        console.log('Mock Data updated successfully:', this.mockCers[index]);
      }

      return of({
        status: 'OK',
        message: 'Modifica mock salvata con successo',
      });
    }

    return this.api.put<any>('api/cer/modifica', updatedCer, options);
  }
}
