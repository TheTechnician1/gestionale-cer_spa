import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  DashboardImpianti,
  DashboardInterfaces,
} from 'src/app/core/interfaces/dashboard.interfaces';
import { tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
  ) {}


  dashboard: DashboardInterfaces | null = null;

  dashboardImpianti: DashboardImpianti[] = [];
  chartLabels: string[] = [];
  chartValues: number[] = [];
  chartLabels1: string[] = [];
  chartValues1: number[] = [];

  valuesTopCer: number[] = [];
  labelsTopCer: string[] = [];
  nameTopCer: string = '';

  valuesSummary: number[] = [];
  labelsSummary: string[] = [];
  nameSummary: string = '';

  animatedComunita = 0;
  animatedImpianti = 0;
  animatedConfigurazioniAttive = 0;
  animatedIncentivi = 0;
  animatedValore = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {

    this.loadKPI();
    this.dashboardService.getDashboardImpianti().subscribe((res) => {
      res.forEach((r) => {
        this.dashboardImpianti = res;
        this.chartValues.push(r.totale);
        this.chartLabels.push(r.stato);
        
      });
    });
 this.dashboardService.getDashboardImpianti1().subscribe((res) => {
      res.forEach((r) => {
    this.chartValues1.push(r.totale);
        this.chartLabels1.push(r.tipologia);
   });
    });

    this.dashboardService.getDashboardAndamento().subscribe((res) => {
      res.forEach((r) => {
    this.valuesSummary.push(r.energiaProdotta);
        this.labelsSummary.push(r.anno);
        this.nameSummary = 'Energia Annuale';
   });
    });

    this.dashboardService.getDashboardTopCer().subscribe((res) => {

  this.valuesTopCer = [];
  this.labelsTopCer = [];

  res.forEach((r) => {
    this.valuesTopCer.push(r.energiaCondivisa);

    this.labelsTopCer.push(`CER ${r.ragioneSociale}`);
  });

  this.nameTopCer = 'Top 5 CER';
});
     
  }
  
  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  animateValue(target: number, setter: (val: number) => void, duration = 800) {
    const start = 0;
    const increment = target / (duration / 16);

    let current = start;

    const step = () => {
      current += increment;

      if (current >= target) {
        setter(target);
        return;
      }

      setter(Math.floor(current));
      requestAnimationFrame(step);
    };

    step();
  }

  loadKPI() {
    this.dashboardService.getSummary().subscribe({
      next: (res: any) => {
        console.log('RAW:', res);

        const data = res?.result || res?.data || res;

        this.dashboard = data;

        this.animateValue(
          res.totaleCer || 0,
          (v) => (this.animatedComunita = v),
        );
        this.animateValue(
          res.impiantiTotali || 0,
          (v) => (this.animatedImpianti = v),
        );
        this.animateValue(
          res.configurazioniAttive || 0,
          (v) => (this.animatedConfigurazioniAttive = v),
        );
        this.animateValue(
          res.incentivi || 0,
          (v) => (this.animatedIncentivi = v),
        );
        this.animateValue(
          res.energiaProdotta || 0,
          (v) => (this.animatedValore = v),
        );
      },
    });
  }
}
