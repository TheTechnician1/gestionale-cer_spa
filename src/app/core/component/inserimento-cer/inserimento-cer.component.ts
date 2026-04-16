import { Component } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stato } from '../../interfaces/stato.model';
import { CERService } from '../../services/cer.service';

@Component({
  selector: 'app-inserimento-cer',
  templateUrl: './inserimento-cer.component.html',
  styleUrls: ['./inserimento-cer.component.scss']
})
export class InserimentoCerComponent {
  cerForm!:FormGroup;
  
  constructor(private fb: FormBuilder, private cerService: CERService ) {}
  
  ngOnInit(): void {
    this.cerForm =this.fb.group({
      ragioneSociale: ['', [Validators.required]],
      partitaIva: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9\d#@èé€çòà°ù§ì£$^!(/>{}'|/`~<)-_%*?&]{8,64}$")]],
      codiceFiscale: ['', [Validators.required]],
      formaGiuridica: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      pec: ['', [Validators.required, Validators.email]],
      sitoWeb: ['', [Validators.required]],
      nomeCognomeReferente: ['', [Validators.required]],
      numeroCabine: ['', [Validators.required]],
      viaSedeLegale: ['', [Validators.required]],
      cap: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      comuneSedeLegale: ['', [Validators.required]],
      provinciaSedeLegale: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      regioneSedeLegale: ['', [Validators.required]],
      statoCer: ['', [Validators.required]],
      attoCosttutivo: [null],
      statutoStipulato: [null],
      regolamentoCer: [null],
      iscrizioneRunts: [false],
      terzoSettore: [false],
      progettiInclusioneSociale: [false],
      areeMontaneInterne: [false],
      progettiCambiamentiClimatici: [false]
    });
    this.cerForm.enable();
  }
  
  stati: Stato[] = [
    { value: 'attivo', viewValue: 'Attivo'},
    { value: 'noattivo', viewValue: 'Non Attivo'}
  ]
  
}
