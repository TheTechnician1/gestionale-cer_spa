import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ApexTooltip,
} from 'ng-apexcharts';
import { DashboardService } from '../services/dashboard.service';
import {
  AndamentoAnno,
  DashboardAlert,
  DashboardSummary,
  ImpiantiPerStato,
  ImpiantiPerTipologia,
  TopCer,
} from '../../core/interfaces/dashboard.model';

interface KpiCard {
  label: string;
  valore: number | string;
  icona: string;
  azione?: () => void;
  classe?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  perStato: ImpiantiPerStato[] = [];
  perTipologia: ImpiantiPerTipologia[] = [];
  andamento: AndamentoAnno[] = [];
  topCer: TopCer[] = [];
  alert: DashboardAlert[] = [];

  caricamento = false;

  kpi: KpiCard[] = [];

  // === Chart configs (ApexCharts) ===
  // Andamento annuale (line)
  andamentoSeries: ApexAxisChartSeries = [];
  andamentoChart: ApexChart = { type: 'bar', height: 280, toolbar: { show: false } };
  andamentoXAxis: ApexXAxis = { categories: [] };
  andamentoYAxis: ApexYAxis = { labels: { formatter: (v) => this.fmtNumero(v) } };
  andamentoStroke: ApexStroke = { curve: 'smooth', width: 2 };
  andamentoLegend: ApexLegend = { position: 'top' };
  andamentoDataLabels: ApexDataLabels = { enabled: false };
  andamentoTooltip: ApexTooltip = { shared: true, intersect: false };

  // Impianti per stato (donut)
  statoSeries: ApexNonAxisChartSeries = [];
  statoLabels: string[] = [];
  statoChart: ApexChart = { type: 'donut', height: 280 };
  statoLegend: ApexLegend = { position: 'bottom' };
  statoPlot: ApexPlotOptions = {
    pie: { donut: { size: '65%' } },
  };

  // Impianti per tipologia (bar)
  tipologiaSeries: ApexAxisChartSeries = [];
  tipologiaChart: ApexChart = { type: 'bar', height: 280, toolbar: { show: false } };
  tipologiaXAxis: ApexXAxis = { categories: [] };
  tipologiaPlot: ApexPlotOptions = {
    bar: { horizontal: true, borderRadius: 4 },
  };
  tipologiaTitle: ApexTitleSubtitle = { text: '' };

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.caricaTutto();
  }

  private caricaTutto(): void {
    this.caricamento = true;
    forkJoin({
      summary: this.dashboardService.summary(),
      perStato: this.dashboardService.impiantiPerStato(),
      perTipologia: this.dashboardService.impiantiPerTipologia(),
      andamento: this.dashboardService.andamentoEnergetico(),
      topCer: this.dashboardService.topCer(),
      alert: this.dashboardService.alert(),
    }).subscribe({
      next: (r) => {
        this.summary = r.summary;
        this.perStato = r.perStato ?? [];
        this.perTipologia = r.perTipologia ?? [];
        this.andamento = (r.andamento ?? []).sort((a, b) =>
          a.anno.localeCompare(b.anno),
        );
        this.topCer = r.topCer ?? [];
        this.alert = r.alert ?? [];
        this.buildKpi();
        this.buildCharts();
        this.caricamento = false;
      },
      error: (err) => {
        console.error('Errore caricamento dashboard:', err);
        this.caricamento = false;
      },
    });
  }

  // ===== KPI con click verso ricerche filtrate =====
  private buildKpi(): void {
    const s = this.summary;
    if (!s) return;
    this.kpi = [
      { label: 'Totale CER', valore: s.totaleCer, icona: 'groups', classe: 'kpi-blue' },
      { label: 'Configurazioni attive', valore: s.configurazioniAttive, icona: 'electrical_services', classe: 'kpi-blue' },
      {
        label: 'Impianti totali',
        valore: s.impiantiTotali,
        icona: 'factory',
        classe: 'kpi-blue',
        azione: () => this.vaiImpianti(),
      },
      {
        label: 'Impianti operativi',
        valore: s.impiantiAttivi,
        icona: 'check_circle',
        classe: 'kpi-green',
        azione: () => this.vaiImpianti('ATTIVO'),
      },
      {
        label: 'In manutenzione',
        valore: this.totaleStato('IN_MANUTENZIONE'),
        icona: 'build',
        classe: 'kpi-amber',
        azione: () => this.vaiImpianti('IN_MANUTENZIONE'),
      },
      {
        label: 'Sospesi',
        valore: this.totaleStato('SOSPESO'),
        icona: 'pause_circle',
        classe: 'kpi-amber',
        azione: () => this.vaiImpianti('SOSPESO'),
      },
      {
        label: 'Dismessi',
        valore: this.totaleStato('DISMESSO'),
        icona: 'block',
        classe: 'kpi-amber',
        azione: () => this.vaiImpianti('DISMESSO'),
      },
      {
        label: 'Potenza totale (kW)',
        valore: this.fmtNumero(s.potenzaTotale),
        icona: 'bolt',
        classe: 'kpi-blue',
        azione: () => this.vaiImpianti(),
      },
      {
        label: 'Energia prodotta',
        valore: this.fmtNumero(s.energiaProdotta),
        icona: 'wb_sunny',
        classe: 'kpi-green',
        azione: () => this.vaiDati(),
      },
      {
        label: 'Energia condivisa',
        valore: this.fmtNumero(s.energiaCondivisa),
        icona: 'share',
        classe: 'kpi-green',
        azione: () => this.vaiDati(),
      },
      {
        label: 'Incentivi maturati (€)',
        valore: this.fmtNumero(s.incentivi),
        icona: 'paid',
        classe: 'kpi-blue',
        azione: () => this.vaiDati(),
      },
      {
        label: 'CO₂ evitata',
        valore: this.fmtNumero(s.co2Evitata),
        icona: 'eco',
        classe: 'kpi-green',
        azione: () => this.vaiDati(),
      },
    ];
  }

  private buildCharts(): void {
    // Andamento annuale
    this.andamentoXAxis = { categories: this.andamento.map((a) => a.anno) };
    this.andamentoSeries = [
      { name: 'Prodotta', data: this.andamento.map((a) => a.energiaProdotta) },
      { name: 'Condivisa', data: this.andamento.map((a) => a.energiaCondivisa) },
      { name: 'Autoconsumata', data: this.andamento.map((a) => a.energiaAutoconsumata) },
    ];

    // Impianti per stato
    this.statoLabels = this.perStato.map((p) => p.stato);
    this.statoSeries = this.perStato.map((p) => p.totale);

    // Impianti per tipologia
    this.tipologiaXAxis = {
      categories: this.perTipologia.map((p) => p.tipologia || '—'),
    };
    this.tipologiaSeries = [
      { name: 'Impianti', data: this.perTipologia.map((p) => p.totale) },
    ];
  }

  /** Conta gli impianti per un dato stato leggendo dalla risposta /impianti-per-stato. */
  totaleStato(stato: string): number {
    return (
      this.perStato.find((p) => p.stato === stato)?.totale ?? 0
    );
  }

  // ===== Navigazione =====
  vaiImpianti(stato?: string): void {
    this.router.navigate(['/impianto'], {
      queryParams: stato ? { statoImpianto: stato } : undefined,
    });
  }

  vaiDati(): void {
    this.router.navigate(['/dati-energetici']);
  }

  vaiCer(idCer: number): void {
    // non c'è una pagina CER lato FE: porto alla lista dati energetici filtrata per CER
    this.router.navigate(['/dati-energetici'], { queryParams: { idCer } });
  }

  // ===== Alert: associa un'icona Material al tipo =====
  iconaAlert(tipo: string): string {
    switch (tipo) {
      case 'IMPIANTI_SOSPESI':
        return 'pause_circle';
      case 'IMPIANTI_MANUTENZIONE':
        return 'build';
      case 'SCHEDE_MANCANTI':
      case 'SCHEDE_MANCANTI_DETTAGLIO':
        return 'assignment_late';
      default:
        return 'info';
    }
  }

  // ===== Formatter numerico semplice =====
  fmtNumero(v: number | string | undefined | null): string {
    if (v === null || v === undefined || v === '') return '0';
    const n = typeof v === 'number' ? v : Number(v);
    if (isNaN(n)) return String(v);
    return n.toLocaleString('it-IT', { maximumFractionDigits: 2 });
  }
}
