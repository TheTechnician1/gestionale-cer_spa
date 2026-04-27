import { Injectable } from '@angular/core';
import { HttpContext } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import {
  AccessoRequest,
  GetListaCER,
  ImpiantoCER,
  RicercaCerRequest,
} from '../interfaces/user.model';
import { ApiService } from './api.service';
import { SILENT_HTTP_ERROR } from '../interceptor/http-status/http-status.interceptor';

export interface RispostaCancellazioneCer {
  idCer?: number;
  ragioneSociale?: string;
  codiceFiscale?: string;
  comuneSedeLegale?: string;
  provinciaSedeLegale?: string;
  regioneLegale?: string;
  formaGiuridica?: string;
  telefono?: string;
  email?: string;
  pec?: string;
  sitoWeb?: string;
  referente?: string;
  flgCanc?: string;
  specFormaGiuridica?: string;
  partitaIVA?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CerService {
  constructor(private apiService: ApiService) {}

  ricercaCer(payload: RicercaCerRequest = {}): Observable<GetListaCER[]> {
    return this.apiService.post<GetListaCER[]>('/cer/ricerca', this.creaPayloadRicerca(payload));
  }

  visualizzaCer(idCer: number, mostraErrore = true): Observable<GetListaCER> {
    return this.apiService.get<GetListaCER>(
      `/cer/visualizza/${idCer}`,
      undefined,
      this.creaContestoErrore(mostraErrore)
    );
  }

  visualizzaCerDisattivate(payload: AccessoRequest): Observable<GetListaCER[]> {
    return this.apiService.post<GetListaCER[]>('/cer/visualizza-cer-disattivate', payload);
  }

  arricchisciCer(cer: GetListaCER[]): Observable<GetListaCER[]> {
    if (cer.length === 0) {
      return of([]);
    }

    return forkJoin(
      cer.map((elemento) => {
        if (!elemento.idCer) {
          return of(elemento);
        }

        return this.visualizzaCer(elemento.idCer, false).pipe(
          map((dettaglio) => ({ ...elemento, ...dettaglio })),
          catchError(() => of(elemento))
        );
      })
    );
  }

  cancellaCer(
    idCer: number,
    credenziali: AccessoRequest
  ): Observable<RispostaCancellazioneCer> {
    return this.apiService.delete<RispostaCancellazioneCer>(`/cer/cancella/${idCer}`, {
      email: credenziali.email,
      password: credenziali.password,
    });
  }

  ricercaImpianti(payload: {
    partitaIva?: string;
    regione?: string;
    provincia?: string;
    comune?: string;
    codiceCabina?: string;
  }): Observable<ImpiantoCER[]> {
    return this.apiService.post<ImpiantoCER[]>('/impianti/ricerca-avanzata', payload);
  }

  statoCer(cer: GetListaCER): string {
    return this.cerDisattiva(cer) ? 'Disabled' : 'Active';
  }

  cerDisattiva(cer: GetListaCER): boolean {
    return this.flagCancellazione(cer) === 'S';
  }

  filtraCerDisattive(cer: GetListaCER[]): GetListaCER[] {
    return cer.filter((elemento) => this.cerDisattiva(elemento));
  }

  filtraCer(
    cer: GetListaCER[],
    filtri: {
      ragioneSociale?: string;
      partitaIVA?: string;
      formaGiuridica?: string;
      comune?: string;
      provincia?: string;
      regione?: string;
    }
  ): GetListaCER[] {
    const ragioneSociale = this.pulisciFiltro(filtri.ragioneSociale);
    const partitaIVA = this.pulisciFiltro(filtri.partitaIVA);
    const formaGiuridica = this.pulisciFiltro(filtri.formaGiuridica);
    const comune = this.pulisciFiltro(filtri.comune);
    const provincia = this.pulisciFiltro(filtri.provincia);
    const regione = this.pulisciFiltro(filtri.regione);

    return cer.filter(
      (elemento) =>
        this.contiene(elemento.ragioneSociale, ragioneSociale) &&
        this.contiene(elemento.partitaIVA, partitaIVA) &&
        this.contiene(elemento.formaGiuridica, formaGiuridica) &&
        this.contiene(elemento.comuneSedeLegale, comune) &&
        this.contiene(elemento.provinciaSedeLegale, provincia) &&
        this.contiene(elemento.regioneLegale, regione)
    );
  }

  estraiFormeGiuridiche(cer: GetListaCER[]): string[] {
    return Array.from(
      new Set(
        cer
          .map((elemento) => elemento.formaGiuridica?.trim())
          .filter((forma): forma is string => !!forma)
      )
    ).sort((a, b) => a.localeCompare(b));
  }

  filtraPerFormaGiuridica(cer: GetListaCER[], formaGiuridica: string): GetListaCER[] {
    const formaNormalizzata = formaGiuridica.trim();

    if (!formaNormalizzata) {
      return cer;
    }

    return cer.filter(
      (elemento) => elemento.formaGiuridica?.trim() === formaNormalizzata
    );
  }

  private creaContestoErrore(mostraErrore: boolean): HttpContext | undefined {
    return mostraErrore
      ? undefined
      : new HttpContext().set(SILENT_HTTP_ERROR, true);
  }

  private creaPayloadRicerca(payload: RicercaCerRequest): RicercaCerRequest {
    return Object.entries(payload).reduce<RicercaCerRequest>((acc, [key, value]) => {
      if (typeof value === 'string' && value.trim().length > 0) {
        return {
          ...acc,
          [key]: value.trim(),
        };
      }

      return acc;
    }, {});
  }

  private flagCancellazione(cer: GetListaCER): string {
    const raw = cer as unknown as Record<string, unknown>;
    const flag =
      cer.flgCanc ??
      raw['flgcancellazione'] ??
      raw['flgCancellazione'] ??
      raw['flg_cancellazione'] ??
      '';

    return String(flag).trim().toUpperCase();
  }

  private contiene(value: unknown, filtro: string): boolean {
    if (!filtro) {
      return true;
    }

    return String(value ?? '').toLowerCase().includes(filtro);
  }

  private pulisciFiltro(value: unknown): string {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
  }
}
