import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';

export interface DatiEnergetici {
  idDati?: number;
  anno?: string;
  idCer?: number;
  partitaIva?: string;
  idConfig?: number;
  codiceCabina?: string;
  statoScheda?: string;
  inizioAnno?: string;
  fineAnno?: string;

  eProdotta?: number;
  ePrelevata?: number;
  eImmessa?: number;
  eCondivisa?: number;
  eAutoCons?: number;
  tariffaPremium?: number;
  corrPremioOtt?: number;
  ridEmCo2?: number;
  flgCancellazione?: string;
  emailUtenteLoggato?: string;
}

@Component({
  selector: 'app-dati-energetici-ricerca',
  templateUrl: './dati-energetici-ricerca.component.html',
  styleUrls: ['./dati-energetici-ricerca.component.scss'],
})
export class DatiEnergeticiRicercaComponent implements OnInit {
  datiEnergetici: DatiEnergetici[] = [];
  anni: string[] = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

  form: FormGroup;
  formInserimento: FormGroup;

  // pannelli a comparsa: partono chiusi
  mostraFiltri = false;
  mostraInserimento = false;

  constructor(
    private datiEnergeticiService: DatiEnergeticiService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      idDati: [null],
      anno: [null],
      idCer: [null],
      partitaIva: [null],
      idConfig: [null],
      codiceCabina: [null],
      statoScheda: [null],
      inizioAnno: [null],
      fineAnno: [null],
    });

    // form del mini-inserimento a comparsa (campi che il mock sa salvare)
    this.formInserimento = this.fb.group({
      idCer: [null, Validators.required],
      anno: [null, Validators.required],
      eProdotta: [0, Validators.required],
      ePrelevata: [0, Validators.required],
      eImmessa: [0, Validators.required],
      eCondivisa: [0, Validators.required],
      eAutoCons: [0, Validators.required],
      tariffaPremium: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.cercaDatiEnergetici();
  }

  cercaDatiEnergetici(): void {
    const payload = this.form.value;

    // Prende i valori inseriti nel form

    this.datiEnergeticiService.ricerca(payload).subscribe({
      // next è una funzione che viene eseguita quando arriva una risposta corretta dal backend.
      // res sarebbe response

      next: (res) => {
        this.datiEnergetici = res ?? [];
      },

      // err sarebbe error

      error: (err) => {
        console.error('Errore caricamento dati:', err);
      },
    });
  }

  modificaDatiEnergetici(id: number | null | undefined): void {
    if (!id) {
      return;
    }

    this.router.navigate(['/dati-energetici/modifica-dati', id]);
  }

  dettaglioDatiEnergetici(id: number | null | undefined): void {
    if (!id) {
      return;
    }

    this.router.navigate(['/dati-energetici/dettaglio-dati', id]);
  }
  // mostra/nasconde il pannello filtri
  toggleFiltri(): void {
    this.mostraFiltri = !this.mostraFiltri;
  }

  // mostra/nasconde il mini-form di inserimento
  toggleInserimento(): void {
    this.mostraInserimento = !this.mostraInserimento;
  }

  // salva un nuovo dato nel mock e ricarica la lista
  salvaNuovo(): void {
    if (this.formInserimento.invalid) {
      this.formInserimento.markAllAsTouched();
      return;
    }

    const v = this.formInserimento.value;
    const nuovo = {
      idDati: 0,
      idCer: v.idCer,
      anno: v.anno,
      eProdotta: v.eProdotta,
      ePrelevata: v.ePrelevata,
      eImmessa: v.eImmessa,
      eCondivisa: v.eCondivisa,
      eAutoCons: v.eAutoCons,
      tariffaPremium: v.tariffaPremium,
      calcoloCo2Automatico: 0,
    };

    this.datiEnergeticiService.inserisci(nuovo).subscribe({
      next: () => {
        // pulisco il form, chiudo il pannello e rinfresco la lista
        this.formInserimento.reset({
          idCer: null,
          anno: null,
          eProdotta: 0,
          ePrelevata: 0,
          eImmessa: 0,
          eCondivisa: 0,
          eAutoCons: 0,
          tariffaPremium: 0,
        });
        this.mostraInserimento = false;
        this.cercaDatiEnergetici();
      },
      error: (err) => console.error('Errore inserimento:', err),
    });
  }
  eliminaDato(id: number | null | undefined): void {
    if (!id) {
      return;
    }
    this.datiEnergeticiService.elimina(id).subscribe({
      next: () => this.cercaDatiEnergetici(),
      error: (err) => console.error('Errore eliminazione:', err),
    });
  }
}
