import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { StorageService } from '../../core/services/storage.service';
import { UtenteLogin } from '../../core/interfaces/utente.model';
import {
  ImpiantoVista,
  ImpiantoDettaglio,
  ImpiantoRequest,
  ImpiantoFiltro,
} from '../../core/interfaces/impianto.model';

@Injectable({ providedIn: 'root' })
export class ImpiantoService {
  constructor(
    private api: ApiService,
    private storage: StorageService,
  ) {}

  private emailUtente(): string {
    return this.storage.getLocal<UtenteLogin>('utente')?.mail ?? '';
  }

  private buildParams(
    f: ImpiantoFiltro = {},
  ): Record<string, string | number | boolean> {
    const params: Record<string, string | number | boolean> = {};
    Object.entries(f).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') params[k] = v as any;
    });
    return params;
  }

  // GET /api/impianti/
  ricerca(filtro: ImpiantoFiltro = {}): Observable<ImpiantoVista[]> {
    return this.api.get<ImpiantoVista[]>(
      'api/impianti/',
      this.buildParams(filtro),
    );
  }

  // GET /api/impianti/{id}
  getById(id: number): Observable<ImpiantoDettaglio> {
    return this.api.get<ImpiantoDettaglio>(`api/impianti/${id}`);
  }

  // POST /api/impianti/create
  inserisci(payload: ImpiantoRequest): Observable<string> {
    return this.api.postText('api/impianti/create', { ...payload });
  }

  // PUT /api/impianti/edit/{id}
  modifica(id: number, payload: ImpiantoRequest): Observable<string> {
    return this.api.putText(`api/impianti/edit/${id}`, { ...payload });
  }

  // DELETE /api/impianti/delete/{id}?email=...  (cancellazione logica)
  elimina(id: number): Observable<string> {
    return this.api.deleteText(`api/impianti/delete/${id}`, {
      email: this.emailUtente(),
    });
  }

  // CAMBIO STATO senza PATCH: leggo il dettaglio, cambio solo statoImpianto, rifaccio la PUT
  cambiaStato(id: number, nuovoStato: string): Observable<string> {
    return this.getById(id).pipe(
      switchMap((dett) => {
        const { idImpianto, ...rest } = dett;
        const payload: ImpiantoRequest = { ...rest, statoImpianto: nuovoStato };
        return this.modifica(id, payload);
      }),
    );
  }
}
