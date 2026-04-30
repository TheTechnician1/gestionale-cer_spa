import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stato } from '../../interfaces/stato.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CERService } from '../../services/cer.service';

@Component({
  selector: 'app-inserimento-cer',
  templateUrl: './inserimento-cer.component.html',
  styleUrls: ['./inserimento-cer.component.scss']
})
export class InserimentoCerComponent {
  cerForm!:FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private cerService: CERService) {}

  ngOnInit(): void {
    this.cerForm = this.fb.group({
      idCer: null,
      ragSociale: ['', [Validators.required]],
      pIva: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9\d#@èé€çòà°ù§ì£$^!(/>{}'|/`~<)-_%*?&]{8,64}$")]],
      codFiscale: ['', [Validators.required]],
      formaGiuridica: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      pec: ['', [Validators.required, Validators.email]],
      sitoWeb: ['', [Validators.required]],
      referente: ['', [Validators.required]],
      comuneLegale: ['', [Validators.required]],
      provinciaLegale: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      regioneLegale: ['', [Validators.required]],
      flgCancellazione: ['', [Validators.required]],
    });
    this.cerForm.get('codFiscale')?.valueChanges.subscribe(value => {
      const upper = value?.toUpperCase() || '';
      if (upper !== value) {
      this.cerForm.get('codFiscale')?.setValue(upper, { emitEvent: false });
      }
    });
    this.cerForm.enable();
  }

  stati: Stato[] = [
    { value: 'attivo', viewValue: 'Attivo'},
    { value: 'noattivo', viewValue: 'Non Attivo'}
  ]

  submitted = false;

  submit() {
    this.submitted = true;

    if (this.cerForm.invalid) {
      this.cerForm.markAllAsTouched();

      this.snackBar.open(
        'Compila tutti i campi obbligatori correttamente',
        'Chiudi',
        { duration: 3000 }
      );
      return;
    }

    this.cerService.createCER(this.cerForm.value).subscribe({
      next: (res) => {
        this.snackBar.open(
          'Inserimento completato!',
          'OK',
          { duration: 2000 }
        );
        console.log('Salvato:', res);

        this.cerForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error(err);

        this.snackBar.open(
          'Errore durante il salvataggio',
          'Chiudi',
          { duration: 3000 }
        );
      }
    });
  }
}
