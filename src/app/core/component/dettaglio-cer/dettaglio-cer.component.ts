import { getTreeControlFunctionsMissingError } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stato } from '../../interfaces/stato.model';


@Component({
  selector: 'app-dettaglio-cer',
  templateUrl: './dettaglio-cer.component.html',
  styleUrls: ['./dettaglio-cer.component.scss']
})
export class DettaglioCerComponent {
  cerForm!:FormGroup;

  constructor(private fb: FormBuilder) {
    
    this.cerForm =this.fb.group({
      regioneSociale: ['', Validators.required],
      partitaIva: ['', Validators.required, Validators.pattern("^[a-zA-Z0-9\d#@èé€çòà°ù§ì£$^!(/>{}'|/`~<)-_%*?&]{8,64}$")],
      codiceFiscale: ['', Validators.required], 
      formaGiuridica: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pec: ['', [Validators.required, Validators.email]],
      sitoWeb: ['', Validators.required],
      nomeCognomeReferente: ['', Validators.required],
      numeroCabine: ['', Validators.required],
      viaSedeLegale: ['', Validators.required],
      cap: ['', Validators.required],
      comuneSedeLegale: ['', Validators.required],
      provinciaSedeLegale: ['', Validators.required],
      regioneSedeLegale: ['', Validators.required],

      statoCer: ['', Validators.required]
    });
  }

  hide = true;
  stati: Stato[] = [
    { value: 'attivo', viewValue: 'Attivo'},
    { value: 'non attivo', viewValue: 'Non attivo'}
  ]
}
