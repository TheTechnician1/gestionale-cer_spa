import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  ricerca(filtro: ImpiantoFiltro = {}): Observable<ImpiantoVista[]> {
    return this.api.get<ImpiantoVista[]>(
      'api/impianti/',
      this.buildParams(filtro),
    );
  }

  getById(id: number): Observable<ImpiantoDettaglio> {
    return this.api.get<ImpiantoDettaglio>(`api/impianti/${id}`);
  }

  inserisci(payload: ImpiantoRequest): Observable<string> {
    return this.api.postText('api/impianti/create', { ...payload });
  }

  modifica(id: number, payload: ImpiantoRequest): Observable<string> {
    return this.api.putText(`api/impianti/edit/${id}`, { ...payload });
  }

  elimina(id: number): Observable<string> {
    return this.api.deleteText(`api/impianti/delete/${id}`, {
      email: this.emailUtente(),
    });
  }

  cambiaStato(id: number, nuovoStato: string): Observable<string> {
    return this.api.patchText(`api/impianti/${id}/stato`, {
      stato: nuovoStato,
      email: this.emailUtente(),
    });
  }
}
