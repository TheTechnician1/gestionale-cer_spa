import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
import { PageEvent } from "@angular/material/paginator";
import { ProdottoModel } from "../../interfaces/prodotto.model";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  SearchFormByName: FormGroup;
  prod: ProdottoModel[] = [];
  paginatedProducts: ProdottoModel[] = [];
  pageIndex = 0;
  pageSize = 5;

  constructor(
    private dashboardService: DashboardService,
    private fb: FormBuilder,
  ) {
    this.SearchFormByName = this.fb.group({
      nome: [""],
    });
  }

   filtro = {
   };

  listaFiltrata = [...this.prod];
  isFiltering = false;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.dashboardService.getDati().subscribe({
      next: (prod) => {
        this.setProducts(prod);
      },
      error: (error) => {
        console.error("Lista Prodotti error", error);
      },
    });
  }

  filtraCER() {
    this.isFiltering = true;
    this.loadProducts();
  }

  resetFiltro() {
    this.isFiltering = false;
    this.filtro = {
    };
    this.listaFiltrata = [...this.prod];
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedProducts();
  }

  onSubmit() {
    if (this.SearchFormByName.valid) {
      const nomeProdotto = this.SearchFormByName.get("nome")?.value?.trim();

      if (!nomeProdotto) {
        console.log("nome inesistente")
        this.loadProducts();
        return;
      }

      this.doSearchByName({nomeProdotto});
      return;
    }

    this.SearchFormByName.markAllAsTouched();
  }

  doSearchByName(payload: any) {
    this.dashboardService.getDatiByName(payload).subscribe({
      next: (prod) => {
        this.setProducts(prod);
      },
      error: (error) => {
        console.error("Lista Prodotti error", error);
      },
    });
  }

  private setProducts(prod: ProdottoModel[]): void {
    this.prod = prod;
    this.pageIndex = 0;
    this.updatePaginatedProducts();
  }

  private updatePaginatedProducts(): void {
    const start = this.pageIndex * this.pageSize;
    this.paginatedProducts = this.prod.slice(start, start + this.pageSize);
  }
}









