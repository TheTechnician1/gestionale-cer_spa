import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inserimento-impianto',
  templateUrl: './inserimento-impianto.component.html',
  styleUrls: ['./inserimento-impianto.component.scss']
})
export class InserimentoImpiantoComponent implements OnInit {

  impiantiForm!: FormGroup;
  
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}
  
  ngOnInit(): void {
    this.impiantiForm = this.fb.group({
    codice_cabina: ['', [Validators.required]],
    data_entrata_esercizio: ['', [Validators.required]],
    tipologia_impianto: ['', [Validators.required]],
    potenza_nominale: ['', [Validators.required]],
    presenza_accumulo: ['', [Validators.required]],
    capacita_accumulo: ['', [Validators.required]],
    tipologia_produttore: ['', [Validators.required]],
    categoria_produttore: ['', [Validators.required]],
    ubicazione_impianto: this.fb.group({
      regione: ['', [Validators.required]],
      provincia: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      comune: ['', [Validators.required]],
      indirizzo: ['', [Validators.required]],
      numero_civico: ['', [Validators.required]],
      cap: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      tipologia_sito: ['', [Validators.required]]
      })
    });
    this.impiantiForm.enable();
  }

  submitted = false;

  submit() {
    this.submitted = true;

    if (this.impiantiForm.invalid) {
      this.impiantiForm.markAllAsTouched();

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
    console.log(this.impiantiForm.value);
  }

}
