import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatiEnergetici } from '../../interfaces/dati-energetici.model';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modifica-dati-energetici',
  templateUrl: './modifica-dati-energetici.component.html',
  styleUrls: ['./modifica-dati-energetici.component.scss']
})
export class ModificaDatiEnergeticiComponent implements OnInit {
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private dati: DatiEnergeticiService, private route: ActivatedRoute) {}

  datiEnergetici?: DatiEnergetici;
  datiEnergeticiForm!: FormGroup;
  submitted = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.datiEnergeticiForm = this.fb.group({
      anno: ['', [Validators.required]],
      eProdotta: ['', [Validators.required]],
      ePrelevata: ['', [Validators.required]],
      eImmessa: ['', [Validators.required]],
      eCondivisa: ['', [Validators.required]],
      eAutoCons: ['', [Validators.required]],
      tariffaPremium: ['', [Validators.required]],
      corrPremioOtt: ['', [Validators.required]],
      ridEmCo2: ['', [Validators.required]],
      flgCancellazione: [''],
      ragSociale: [''],
      codiceCabina: ['']
    });
    this.datiEnergeticiForm.enable();
    this.loadDati(parseInt(id!));
  }

  loadDati(id: number) {
    this.dati.getDato(id).subscribe({
      next: (dato) => {
        this.datiEnergetici = dato[0];

        if(this.datiEnergeticiForm) {
          this.datiEnergeticiForm.patchValue({
            anno: this.datiEnergetici.anno,
            eProdotta: this.datiEnergetici.eProdotta,
            ePrelevata: this.datiEnergetici.ePrelevata,
            eImmessa: this.datiEnergetici.eImmessa,
            eCondivisa: this.datiEnergetici.eCondivisa,
            eAutoCons: this.datiEnergetici.eAutoCons,
            tariffaPremium: this.datiEnergetici.tariffaPremium,
            corrPremioOtt: this.datiEnergetici.corrPremioOtt,
            ridEmCo2: this.datiEnergetici.ridEmCo2,
            flgCancellazione: this.datiEnergetici.flgCancellazione,
            ragSociale: this.datiEnergetici.configurazioneCer?.cer?.ragSociale,
            codiceCabina: this.datiEnergetici.configurazioneCer?.codiceCabina
          })
        }
      },
      error: (err) => {
        console.log("Errore imprevisto: ", err);
      }
    })
  }

  editDati(payload: any) {
    this.dati.editDatiEnergetici(payload).subscribe({
      next: (res) => {
        this.snackBar.open('Modifica completata!');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteDati() {
    const id = { ...this.datiEnergeticiForm.value, id: this.datiEnergetici?.idDati }
    this.dati.deleteDatiEnergetici(id).subscribe({
      next: (res) => {
        this.snackBar.open('Elimina completata!');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  submit() {
    this.submitted = true;

    if (this.datiEnergeticiForm.invalid) {
      this.datiEnergeticiForm.markAllAsTouched();

      this.snackBar.open(
        'Compila tutti i campi obbligatori correttamente',
        'Chiudi',
        {
          duration: 3000
        }
      );
      return;
    }

    this.snackBar.open(
      'Inserimento completato!',
      'OK',
      {
        duration: 2000
      }
    );
    console.log(this.datiEnergeticiForm.value);
    const payload = { ...this.datiEnergeticiForm.value, id: this.datiEnergetici?.idDati }
    this.editDati(payload);
  }
}
