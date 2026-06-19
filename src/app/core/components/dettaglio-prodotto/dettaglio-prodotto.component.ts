import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DashboardService } from "../../services/dashboard.service";
import { ProdottoModel } from "../../interfaces/prodotto.model";

@Component({
  selector: "app-dettaglio-prodotto",
  templateUrl: "./dettaglio-prodotto.component.html",
  styleUrls: ["./dettaglio-prodotto.component.scss"],
})
export class DettaglioProdottoComponent implements OnInit {
  prodotto?: ProdottoModel;
  isLoading = false;
  errorMessage = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.errorMessage = "Prodotto non trovato.";
      return;
    }

    this.isLoading = true;
    this.dashboardService.getDatiById(id).subscribe({
      next: (prodotto) => {
        this.prodotto = prodotto;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Dettaglio prodotto error", error);
        this.errorMessage = "Non e stato possibile caricare il dettaglio del prodotto.";
        this.isLoading = false;
      },
    });
  }

  tornaAllaDashboard(): void {
    this.router.navigate(["dashboard"]);
  }
}
