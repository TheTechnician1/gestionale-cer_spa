import { Component, OnInit } from "@angular/core";
import { DatiEnergetici } from "src/app/core/interfaces/dati-energetici.model";
  import { DatiEnergeticiService } from "../../services/dati-energetici.service";

type FiltroRicerca = {
  cer: string;
  cabina: string;
  annoDa: number;
  annoA: number;
};


@Component({
  selector: "app-dati-energetici-ricerca",
  templateUrl: "./dati-energetici-ricerca.component.html",
  styleUrls: ["./dati-energetici-ricerca.component.scss"],
})
export class DatiEnergeticiRicercaComponent implements OnInit {

  selectedCer: string = "";

  cerList: string[] = ["CER Milano", "CER Roma", "CER Torino"];

  selectedCabina: string = "";

  cabinaList: string[] = ["Cabina Milano", "Cabina Roma", "Cabina Torino"];

  annoDa: number | null = null;
  annoA: number | null = null;

  anniList: number[] = [];

  filtriSelezionati: FiltroRicerca[] = [];

  datiEnergetici: DatiEnergetici[] = [];

  dettaglioImpianto: DatiEnergetici | null = null;

  constructor(private datiEnergeticiService: DatiEnergeticiService) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= 1900; i--) {
      this.anniList.push(i);
    }

    const defaultYear = currentYear - 1;
    this.annoDa = defaultYear;
    this.annoA = defaultYear;
  }

  search(): void {

    console.log("Ricerca avviata");

    const errors = this.validateDati();

    if (errors.length > 0) {
      console.error("Errori validazione:", errors);
      return;
    }

    const filtro: FiltroRicerca = {
      cer: this.selectedCer,
      cabina: this.selectedCabina,
      annoDa: this.annoDa!,
      annoA: this.annoA!
    };

    this.filtriSelezionati.push(filtro);

    this.datiEnergetici = [
      {
        idDati: 1,
         idCer: 2,
         idConfig:3,
        anno: 2024,
        eProdotta: 120,
        ePrelevata: 80,
        eImmessa: 40,
        eCondivisa: 60,
        eAutoCons: 50,
        tariffaPremium: 12,
        corrPremioOtt: 45,
        ridEmCo2: "12",
        calcoloCo2Automatic:13,
         note: "OK",
        flgCancellazione: null
      },
      {
        idDati: 2,
         idCer: 4,
         idConfig:5,
        anno: 2023,
        eProdotta: 110,
        ePrelevata: 70,
        eImmessa: 39,
        eCondivisa: 55,
        eAutoCons: 48,
        tariffaPremium: 11,
        corrPremioOtt: 42,
        ridEmCo2: "11",
         calcoloCo2Automatic:13,
        note: "DA_VERIFICARE",
        flgCancellazione: null
      }
    ];
  }

  validateDati(): string[] {

    const errors: string[] = [];

    if (!this.selectedCer) errors.push("CER obbligatorio");
    if (!this.selectedCabina) errors.push("Cabina obbligatoria");

    if (this.annoDa == null || this.annoA == null) {
      errors.push("Anno obbligatorio");
    }

    if (this.annoDa != null && this.annoA != null && this.annoDa > this.annoA) {
      errors.push("Da Anno non può essere maggiore di A Anno");
    }

    return errors;
  }

  // =========================
  // VALIDAZIONI NUMERICHE
  // =========================

  isInteger(value: number | null): boolean {
    return value != null && Number.isInteger(value);
  }

  hasMaxTwoDecimals(value: number | null): boolean {
    return value != null && /^\d+(\.\d{1,2})?$/.test(value.toString());
  }

  validateEnergia(value: number | null, fieldName: string, errors: string[]) {

    if (value == null) {
      errors.push(`${fieldName} obbligatorio`);
      return;
    }

    if (value < 0) {
      errors.push(`${fieldName} non può essere negativo`);
    }

    if (!Number.isInteger(value)) {
      errors.push(`${fieldName} deve essere un numero intero`);
    }
  }

  validateEconomico(value: number | null, fieldName: string, errors: string[]) {

    if (value == null) {
      errors.push(`${fieldName} obbligatorio`);
      return;
    }

    if (value < 0) {
      errors.push(`${fieldName} deve essere >= 0`);
    }

    if (!this.hasMaxTwoDecimals(value)) {
      errors.push(`${fieldName} massimo 2 decimali`);
    }
  }

  // =========================
  // VALIDAZIONE FORM BASE
  // =========================

  isFormValid(): boolean {

    return !!(
      this.selectedCer &&
      this.selectedCabina &&
      this.annoDa &&
      this.annoA &&
      this.annoDa <= this.annoA
    );
  }

  //filter() crea un nuovo array contenente solo gli elementi che rispettano la condizione.--> item !== dato vuol dire: “tieni tutti gli elementi tranne quello cliccato”

  eliminaDati(dato: any): void {

  this.datiEnergetici = this.datiEnergetici.filter(
    item => item !== dato
  );
}

  modificaDati(impianto: DatiEnergetici): void {

  const id = impianto.idDati;

  if (!id) {
    console.warn("ID non presente");
    return;
  }

  this.datiEnergeticiService.editDatiEnergetici(this.dettaglioImpianto!).subscribe({
    next: (res) => {
      // il backend ti ritorna un array → prendi il primo elemento
      this.dettaglioImpianto = res;

      console.log("Dettaglio caricato:", this.dettaglioImpianto);
    },
    error: (err) => {
      console.error("Errore nel recupero dettaglio", err);
    }
  });
}
visualizzaDato(idDati:number): void {
 const id = idDati;

  if (!id) {
    console.warn("ID non presente");
    return;
  }

  this.datiEnergeticiService.getDato(id).subscribe({
    next: (res) => {
      // il backend ti ritorna un array → prendi il primo elemento
      this.dettaglioImpianto = res?.[0] ?? null;

      console.log("Dettaglio caricato:", this.dettaglioImpianto);
    },
    error: (err) => {
      console.error("Errore nel recupero dettaglio", err);
    }
  });


}

}