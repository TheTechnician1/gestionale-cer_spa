import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inserimento-dati-energetici',
  templateUrl: './inserimento-dati-energetici.component.html',
  styleUrls: ['./inserimento-dati-energetici.component.scss'],
})
export class InserimentoDatiEnergeticiComponent implements OnInit {

  datiEnergeticiForm!: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.datiEnergeticiForm = this.fb.group({
     idCer: ['', [Validators.required]],
     idConfigurazione: ['', [Validators.required]],
     anno: ['', [Validators.required]],
     eProdotta: ['', [Validators.required]],
     ePrelevata: ['', [Validators.required]],
     eImmessa: ['', [Validators.required]],
     eCondivisa: ['', [Validators.required]],
     eAutoCons: ['', [Validators.required]],
     tariffaPremium: ['', [Validators.required]],
     corrPremioOtt: ['', [Validators.required]],
     ridEmCo2: ['', [Validators.required]]
    });
    this.datiEnergeticiForm.enable();
  }

  submitted = false;

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
  }

}

