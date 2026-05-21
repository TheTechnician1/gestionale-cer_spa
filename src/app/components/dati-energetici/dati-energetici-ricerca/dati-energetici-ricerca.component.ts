import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { DatiEnergetici } from "src/app/core/interfaces/dati-energetici.model";
import { DatiEnergeticiService } from "../../services/dati-energetici.service";
import { ConfirmationDialogComponent, DialogCloseReason } from "src/app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { CerService } from "../../services/cer.service";
import { CerModel } from "src/app/core/interfaces/cer.model";

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
//cerList: CerModel[] = [];
  cabinaList: string[] = ["Cabina Milano", "Cabina Roma", "Cabina Torino"];
//cabinaList: any[] = [];

  anniList: number[] = [];

  datiEnergetici: DatiEnergetici[] = [];

  @ViewChild("confirmationDialog") confirmationDialog!: ConfirmationDialogComponent;

  constructor(
    private fb: FormBuilder,
    private datiEnergeticiService: DatiEnergeticiService,
    private router: Router,
    private cerService: CerService
  ) {}

  ngOnInit(): void {

  // this.form = this.fb.group({
  //   idCer: [null, Validators.required],
  //   anno: [new Date().getFullYear(), Validators.required],
  //   eProdotta: [0, Validators.required],
  //   ePrelevata: [0],
  //   eImmessa: [0],
  //   eCondivisa: [0],
  //   eAutoCons: [0],
  //   tariffaPremium: [0],
  //   note: [""]
  // });
//   this.initForm();
//     this.loadCer();
//     this.initAnni();
// }
//  private initForm(): void {
//     const currentYear = new Date().getFullYear();

//     this.formRicerca = this.fb.group({
//       cer: [null, Validators.required],
//       cabina: [null],
//       annoDa: [currentYear - 1, Validators.required],
//       annoA: [currentYear, Validators.required]
//     });
//   }

//     private initAnni(): void {
//     const currentYear = new Date().getFullYear();

//     this.anniList = Array.from(
//       { length: currentYear - 1899 },
//       (_, i) => currentYear - i
//     );
//   }

//    private loadCer(): void {
//     this.cerService.getCer().subscribe({
//       next: (res) => {
//         this.cerList = res;
//       },
//       error: (err) => console.error("Errore caricamento CER:", err)
//     });
//   }

//  search(): void {

//     if (this.formRicerca.invalid) {
//       this.formRicerca.markAllAsTouched();
//       return;
//     }

//     const filters = this.formRicerca.value;

//     console.log("FILTRI RICERCA:", filters);

//        this.datiEnergeticiService.getDati(filters).subscribe({
//     next: (res) => {
//       this.datiEnergetici = res;
//     },
//     error: (err) => {
//       console.error("Errore ricerca:", err);
//       this.datiEnergetici = [];
//     }
//        });
//        this.cerService.getCer().subscribe({
//   next: (res) => {
//     this.cerList = res;
//   }
// });
//  }

//   inserisciDati(): void {
//     this.router.navigate(['/dati-energetici/form']);
//   }

//   visualizzaDato(id: number | null): void {
//     if (!id) return;
//     this.router.navigate(['/dati-energetici/view', id]);
//   }

//   modificaDati(id: number | null): void {
//     if (!id) return;
//     this.router.navigate(['/dati-energetici/edit', id]);
//   }

//     eliminaDati(dato: any): void {
//     this.datiEnergetici = this.datiEnergetici.filter(d => d !== dato.payload);
//   }

 



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

  this.router.navigate(['/dati-energetici/view', idDati]);
}

  modificaDati(idDati: number | null): void {
    if (!idDati) return;

    this.router.navigate(['/dati-energetici/edit', idDati]);
  }

  openDialog(dato: DatiEnergetici): void {
    this.confirmationDialog.open({
      payload: dato
    });
  }

  onCancel(): void {
    console.log("Annullato");
  }

  onClosed(reason: DialogCloseReason): void {
    console.log("Chiuso:", reason);
  }

  eliminaDati(dato: any): void {
    this.datiEnergetici = this.datiEnergetici.filter(d => d !== dato.payload);
  }

  inserisciDati(): void {
    this.router.navigate(['/dati-energetici/form']);
  }

   
}

