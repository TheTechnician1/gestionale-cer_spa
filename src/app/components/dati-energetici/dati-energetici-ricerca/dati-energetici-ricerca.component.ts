import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { DatiEnergetici } from "src/app/core/interfaces/dati-energetici.model";
import { DatiEnergeticiService } from "../../services/dati-energetici.service";

const MOCK_DATI: DatiEnergetici[] = [
  {
    idDati: 1,
    idCer: 2,
    idConfig: 3,
    anno: 2024,
    eProdotta: 120,
    ePrelevata: 80,
    eImmessa: 40,
    eCondivisa: 60,
    eAutoCons: 50,
    tariffaPremium: 12,
    corrPremioOtt: 45,
    ridEmCo2: "12",
    calcoloCo2Automatic: 13,
    note: "OK",
    flgCancellazione: null
  },
  {
    idDati: 2,
    idCer: 4,
    idConfig: 5,
    anno: 2023,
    eProdotta: 110,
    ePrelevata: 70,
    eImmessa: 39,
    eCondivisa: 55,
    eAutoCons: 48,
    tariffaPremium: 11,
    corrPremioOtt: 42,
    ridEmCo2: "11",
    calcoloCo2Automatic: 13,
    note: "DA_VERIFICARE",
    flgCancellazione: null
  }
];


@Component({
  selector: "app-dati-energetici-ricerca",
  templateUrl: "./dati-energetici-ricerca.component.html",
  styleUrls: ["./dati-energetici-ricerca.component.scss"],
})
export class DatiEnergeticiRicercaComponent implements OnInit {

  formRicerca!: FormGroup;

  cerList: string[] = ["CER Milano", "CER Roma", "CER Torino"];
  cabinaList: string[] = ["Cabina Milano", "Cabina Roma", "Cabina Torino"];

  anniList: number[] = [];

  datiEnergetici: DatiEnergetici[] = [];

  constructor(
    private fb: FormBuilder,
    private datiEnergeticiService: DatiEnergeticiService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const currentYear = new Date().getFullYear();

    this.anniList = Array.from(
      { length: currentYear - 1899 },
      (_, i) => currentYear - i
    );

    this.formRicerca = this.fb.group({
      cer: ["", Validators.required],
      cabina: ["", Validators.required],
      annoDa: [currentYear - 1, Validators.required],
      annoA: [currentYear - 1, Validators.required]
    });
  }

  search(): void {

    if (this.formRicerca.invalid) {
      this.formRicerca.markAllAsTouched();
      return;
    }

    const payload = this.formRicerca.value;
    console.log("VALORI FORM:", payload);

    // MOCK
    this.datiEnergetici = MOCK_DATI;
  }

  visualizzaDato(idDati: number | null): void {
    if (!idDati) return;

    this.datiEnergeticiService.getDato(idDati).subscribe({
      next: (res) => {
        console.log("Dettaglio:", res?.[0]);
      },
      error: (err) => console.error(err)
    });
  }

  modificaDati(idDati: number | null): void {
    if (!idDati) return;

    this.router.navigate(['/dati-energetici/edit', idDati]);
  }

  eliminaDati(dato: DatiEnergetici): void {
    this.datiEnergetici = this.datiEnergetici.filter(d => d !== dato);
  }
}