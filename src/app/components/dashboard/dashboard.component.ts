import { Component, OnInit, ViewChild } from "@angular/core";
import { DashboardService } from "../services/dashboard.service";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSort, Sort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from '@angular/router';

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

  tableCER: string[] = ["ragSociale", "codFisc", "pIva", "comune", "provincia", "regione", "azioni"];

  cer: any[] = [];

  dataSource = new MatTableDataSource(this.cer);
  sortedData: any[] | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filtro = {
    ragSociale: "",
    codFisc: "",
    pIva: "",
    comune: "",
    provincia: "",
    regione: "",
  };

  listaFiltrata = [...this.cer];
  isFiltering = false;

  ngOnInit() {
    this.loadCERS();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadCERS() {
    this.dashboardService.getDati(this.filtro).subscribe({
      next: (cer) => {
        this.cer = cer;
        this.dataSource.data = [...this.cer];
        this.listaFiltrata = [...this.cer];
      },
      error: (error) => {
        console.error("Login error", error);
      },
    });
  }

  filtraCER() {
    this.isFiltering = true;
    this.loadCERS();
  }

  resetFiltro() {
    this.isFiltering = false;
    this.filtro = {
      ragSociale: "",
      codFisc: "",
      pIva: "",
      comune: "",
      provincia: "",
      regione: "",
    };
    this.listaFiltrata = [...this.cer];
    this.loadCERS();
  }

  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
     
  }
 
}
