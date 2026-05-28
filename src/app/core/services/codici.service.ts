import { Injectable } from '@angular/core';
import { Observable, of, catchError, tap } from 'rxjs';
import { ApiService } from './api.service';
import { CodiceDescrizioneBase } from '../interfaces/impianto.model';

export type TabellaCodici =
  | 'REGIONI'
  | 'PROVINCE'
  | 'COMUNI'
  | 'FORME_GIURIDICHE'
  | 'TIPOLOGIE_IMPIANTO'
  | 'CATEGORIE_PRODUTTORE'
  | 'SITI_INSTALLAZIONE';

@Injectable({ providedIn: 'root' })
export class CodiciService {
  private cache = new Map<string, CodiceDescrizioneBase[]>();

  constructor(private api: ApiService) {}

  list(
    tabella: TabellaCodici,
    parameter?: string | number | null,
  ): Observable<CodiceDescrizioneBase[]> {
    const key = `${tabella}::${parameter ?? ''}`;

    const cached = this.cache.get(key);
    if (cached) return of(cached);

    const params: Record<string, string | number | boolean> = {};
    if (parameter !== null && parameter !== undefined && parameter !== '') {
      params['parameter'] = parameter;
    }

    return this.api
      .get<CodiceDescrizioneBase[]>(`codici/${tabella}`, params, { skipToast: true })
      .pipe(
        catchError(() => of<CodiceDescrizioneBase[]>([])),
        tap((res) => {
          if (Array.isArray(res) && res.length > 0) {
            this.cache.set(key, res);
          }
        }),
      );
  }

  invalidate(): void {
    this.cache.clear();
  }
}
