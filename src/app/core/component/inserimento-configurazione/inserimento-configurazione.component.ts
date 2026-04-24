import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inserimento-configurazione',
  templateUrl: './inserimento-configurazione.component.html',
  styleUrls: ['./inserimento-configurazione.component.scss'],
})
export class InserimentoConfigurazioneComponent implements OnInit {

  configForm!: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.configForm = this.fb.group({
      codiceCabina: ['', [Validators.required]],
      annoAttivazione: ['', [Validators.required]]
    });
    this.configForm.enable();
  }

  submitted = false;

  submit() {
    this.submitted = true;

    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();

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
    console.log(this.configForm.value);
  }

}
