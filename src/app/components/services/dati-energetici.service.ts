import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { StorageService } from '../../core/services/storage.service';
import { UtenteLogin } from '../../core/interfaces/utente.model';
import {
  DatiEnergeticiVista,
  DatiEnergeticiDettaglio,
  DatiEnergeticiRequest,
  DatiEnergeticiFiltro,
  StoricoSchedaEnergetica,
} from '../../core/interfaces/dati-energetici.model';

@Injectable({ providedIn: 'root' })
export class DatiEnergeticiService {
  constructor(
    private api: ApiService,
    private storage: StorageService,
  ) {}

  private emailUtente(): string {
    return this.storage.getLocal<UtenteLogin>('utente')?.mail ?? '';
  }

  private buildParams(
    f: DatiEnergeticiFiltro = {},
  ): Record<string, string | number | boolean> {
    const params: Record<string, string | number | boolean> = {};
    Object.entries(f).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') {
        params[k] = v as string | number | boolean;
      }
    });
    return params;
  }

  ricerca(filtro: DatiEnergeticiFiltro = {}): Observable<DatiEnergeticiVista[]> {
    return this.api.get<DatiEnergeticiVista[]>(
      'api/dati-energetici/',
      this.buildParams(filtro),
    );
  }

  getById(id: number): Observable<DatiEnergeticiDettaglio | null> {
    return this.api
      .get<DatiEnergeticiDettaglio[] | DatiEnergeticiDettaglio>(
        `api/dati-energetici/${id}`,
      )
      .pipe(
        map((res) => (Array.isArray(res) ? (res[0] ?? null) : (res ?? null))),
      );
  }

  inserisci(payload: DatiEnergeticiRequest): Observable<string> {
    return this.api.postText('api/dati-energetici/create', { ...payload });
  }

  modifica(id: number, payload: DatiEnergeticiRequest): Observable<string> {
    return this.api.putText(`api/dati-energetici/edit/${id}`, { ...payload });
  }

  elimina(id: number): Observable<string> {
    return this.api.deleteText(`api/dati-energetici/delete/${id}`, {
      email: this.emailUtente(),
    });
  }

  checkDuplicato(
    idConfigurazione: number,
    anno: string,
  ): Observable<{ duplicato: boolean; messaggio: string }> {
    return this.api
      .getText('api/dati-energetici/check', { idConfigurazione, anno })
      .pipe(
        map((testo) => ({
          duplicato: !testo.toLowerCase().includes('nessuna'),
          messaggio: testo,
        })),
      );
  }

  ricercaCer(): Observable<CerLista[]> {
    return this.api.postLogin<CerLista[]>('cer/ricerca', {});
  }

  getStorico(idConfigurazione: number): Observable<StoricoSchedaEnergetica[]> {
    return this.api.get<StoricoSchedaEnergetica[]>(
      `api/dati-energetici/configurazioni/${idConfigurazione}`,
    );
  }
}

export interface CerLista {
  idCer: number;
  ragSociale: string;
}
