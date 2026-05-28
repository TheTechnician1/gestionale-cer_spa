import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import {
  AndamentoAnno,
  DashboardAlert,
  DashboardSummary,
  ImpiantiPerStato,
  ImpiantiPerTipologia,
  TopCer,
} from '../../core/interfaces/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}

  summary(anno?: number | string, anno2?: number | string): Observable<DashboardSummary> {
    const params: Record<string, string | number | boolean> = {};
    if (anno !== undefined && anno !== null && anno !== '') params['anno'] = anno;
    if (anno2 !== undefined && anno2 !== null && anno2 !== '') params['anno2'] = anno2;
    return this.api.get<DashboardSummary>('api/dashboard/summary', params);
  }

  impiantiPerStato(): Observable<ImpiantiPerStato[]> {
    return this.api.get<ImpiantiPerStato[]>('api/dashboard/impianti-per-stato');
  }

  impiantiPerTipologia(): Observable<ImpiantiPerTipologia[]> {
    return this.api.get<ImpiantiPerTipologia[]>(
      'api/dashboard/impianti-per-tipologia',
    );
  }

  andamentoEnergetico(): Observable<AndamentoAnno[]> {
    return this.api.get<AndamentoAnno[]>('api/dashboard/andamento-energetico');
  }

  topCer(): Observable<TopCer[]> {
    return this.api.get<TopCer[]>('api/dashboard/top-cer');
  }

  alert(): Observable<DashboardAlert[]> {
    return this.api.get<DashboardAlert[]>('api/dashboard/alert');
  }
}
