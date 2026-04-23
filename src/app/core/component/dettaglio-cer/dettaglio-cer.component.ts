import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stato } from '../../interfaces/stato.model';
import { CERService } from '../../services/cer.service';
import { CER } from '../../interfaces/cer.model';

@Component({
  selector: 'app-dettaglio-cer',
  templateUrl: './dettaglio-cer.component.html',
  styleUrls: ['./dettaglio-cer.component.scss']
})
export class DettaglioCerComponent implements OnInit {
  constructor(private fb: FormBuilder, private cerService: CERService) {}
  cer?: CER;

  cerForm!:FormGroup;

  stati: Stato[] = [
    { value: 'attivo', viewValue: 'Attivo'},
    { value: 'noattivo', viewValue: 'Non Attivo'}
  ]

  ngOnInit(): void {
    this.cerForm = this.fb.group({
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
      iscrizioneRunts: [false],
      terzoSettore: [false],
      progettiInclusioneSociale: [false],
      areeMontaneInterne: [false],
      progettiCambiamentiClimatici: [false]
    });
    this.cerForm.disable();
  }

  loadCER() {
    this.cerService.getCER(this.cerForm).subscribe({
      next: (cer) => {
      this.cer = cer;
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }
}
