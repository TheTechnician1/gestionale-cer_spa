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

  summary(): Observable<DashboardSummary> {
    return this.api.get<DashboardSummary>('api/dashboard/summary');
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
