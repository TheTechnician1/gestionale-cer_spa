import { Component, OnInit, ViewChild } from "@angular/core";
import { DashboardService } from "../services/dashboard.service";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSort, Sort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from '@angular/router';
import { DashboardInterfaces } from "src/app/core/interfaces/dashboard.interfaces";


@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
  ) {}

  // tableCER: string[] = ["ragSociale", "codFisc", "pIva", "comune", "provincia", "regione", "azioni"];

  // cer: any[] = [];

  // dataSource = new MatTableDataSource(this.cer);
  // sortedData: any[] | undefined;

  dashboard: DashboardInterfaces | null = null;

animatedComunita = 0;
animatedImpianti = 0;
animatedConfigurazioniAttive = 0;
animatedIncentivi = 0;
animatedValore = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  

  // filtro = {
  //   ragSociale: "",
  //   codFisc: "",
  //   pIva: "",
  //   comune: "",
  //   provincia: "",
  //   regione: "",
  // };

  // listaFiltrata = [...this.cer];
  // isFiltering = false;

  ngOnInit() {
    // this.loadCERS();
     this.loadKPI();
  }

  // ngAfterViewInit() {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  // }

  // loadCERS() {
  //   this.dashboardService.getDati(this.filtro).subscribe({
  //     next: (cer) => {
  //       this.cer = cer;
  //       this.dataSource.data = [...this.cer];
  //       this.listaFiltrata = [...this.cer];
  //     },
  //     error: (error) => {
  //       console.error("Login error", error);
  //     },
  //   });
  // }

  // filtraCER() {
  //   this.isFiltering = true;
  //   this.loadCERS();
  // }

  // resetFiltro() {
  //   this.isFiltering = false;
  //   this.filtro = {
  //     ragSociale: "",
  //     codFisc: "",
  //     pIva: "",
  //     comune: "",
  //     provincia: "",
  //     regione: "",
  //   };
  //   this.listaFiltrata = [...this.cer];
  //   this.loadCERS();
  // }

  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
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

  console.log("RAW:", res);

  const data = res?.result || res?.data || res;

  this.dashboard = data;

this.animateValue(res.totaleCer || 0, v => this.animatedComunita = v);
this.animateValue(res.impiantiTotali || 0, v => this.animatedImpianti = v);
this.animateValue(res.configurazioniAttive || 0, v => this.animatedConfigurazioniAttive = v);
this.animateValue(res.incentivi || 0, v => this.animatedIncentivi = v);
this.animateValue(res.energiaProdotta || 0, v => this.animatedValore = v);
}
  });
}
 
}
