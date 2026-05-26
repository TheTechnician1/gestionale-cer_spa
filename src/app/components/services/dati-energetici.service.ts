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

  // GET /api/dati-energetici/
  ricerca(filtro: DatiEnergeticiFiltro = {}): Observable<DatiEnergeticiVista[]> {
    return this.api.get<DatiEnergeticiVista[]>(
      'api/dati-energetici/',
      this.buildParams(filtro),
    );
  }

  // GET /api/dati-energetici/{id}
  // Il backend ritorna un ARRAY anche se l'id punta a un singolo record:
  // estraiamo il primo elemento per usarlo come oggetto.
  getById(id: number): Observable<DatiEnergeticiDettaglio | null> {
    return this.api
      .get<DatiEnergeticiDettaglio[] | DatiEnergeticiDettaglio>(
        `api/dati-energetici/${id}`,
      )
      .pipe(
        map((res) => (Array.isArray(res) ? (res[0] ?? null) : (res ?? null))),
      );
  }

  // POST /api/dati-energetici/create
  inserisci(payload: DatiEnergeticiRequest): Observable<string> {
    return this.api.postText('api/dati-energetici/create', { ...payload });
  }

  // PUT /api/dati-energetici/edit/{id}
  modifica(id: number, payload: DatiEnergeticiRequest): Observable<string> {
    return this.api.putText(`api/dati-energetici/edit/${id}`, { ...payload });
  }

  // DELETE /api/dati-energetici/delete/{id}?email=...  (cancellazione logica)
  elimina(id: number): Observable<string> {
    return this.api.deleteText(`api/dati-energetici/delete/${id}`, {
      email: this.emailUtente(),
    });
  }

  // GET /api/dati-energetici/check?idConfigurazione=&anno=
  // Risposta in TESTO. Convenzione: se contiene "Nessuna scheda" -> nessun
  // duplicato; altrimenti scheda già presente.
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

  // POST /cer/ricerca  -> lista CER (per popolare la tendina nel form)
  ricercaCer(): Observable<CerLista[]> {
    return this.api.postLogin<CerLista[]>('cer/ricerca', {});
  }
}

// Forma minima della CER usata per popolare la tendina
export interface CerLista {
  idCer: number;
  ragSociale: string;
}
