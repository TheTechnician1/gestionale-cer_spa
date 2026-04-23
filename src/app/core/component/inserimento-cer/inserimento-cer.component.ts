import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stato } from '../../interfaces/stato.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inserimento-cer',
  templateUrl: './inserimento-cer.component.html',
  styleUrls: ['./inserimento-cer.component.scss']
})
export class InserimentoCerComponent {
  cerForm!:FormGroup;
  
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}
  
  ngOnInit(): void {
    this.cerForm =this.fb.group({
      ragSociale: ['', [Validators.required]],
      pIva: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9\d#@èé€çòà°ù§ì£$^!(/>{}'|/`~<)-_%*?&]{8,64}$")]],
      codFisc: ['', [Validators.required]],
      formaGiuridica: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      pec: ['', [Validators.required, Validators.email]],
      sitoWeb: ['', [Validators.required]],
      referente: ['', [Validators.required]],
      comune: ['', [Validators.required]],
      provincia: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      regione: ['', [Validators.required]],
      statoCer: ['', [Validators.required]],
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
      // return;
      this.cerForm.markAllAsTouched();

      this.snackBar.open(
        'Compila tutti i campi obbligatori correttamente',
        // 'Chiudi',
        // {
        //   duration: 3000
        // }
      );

    // console.log(this.cerForm.value);
    return;
    }

    this.snackBar.open(
      'Inserimento completato!',
      // 'OK',
      // {
      //   duration: 2000
      // }
    );
    console.log(this.cerForm.value);
  }
  
}