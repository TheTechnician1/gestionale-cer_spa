import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dettaglio-cer',
  templateUrl: './dettaglio-cer.component.html',
  styleUrls: ['./dettaglio-cer.component.scss']
})
export class DettaglioCerComponent implements OnInit {
  
  cerForm!: FormGroup;
  
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void{
    this.cerForm = this.fb.group({
        regioneSociale: [''],
        partitaIva: [''],
        codiceFiscale: [''],
        formaGiuridica: [''],
        telefono: [''],
        email: [''],
        pec: [''],
        sitoWeb: [''],
        nomeCognomeReferente: [''],
        numeroCabine: [''],
        viaSedeLegale: [''],
        cap: [''],
        comuneSedeLegale: [''],
        provinciaSedeLegale: [''],
        regioneSedeLegale: [''],
        statoCer: [''],
        iscrizioneRunts: [false],
        terzoSettore: [false],
        progettiInclusioneSociale: [false],
        areeMontaneOInterne: [false],
        progettiCambiamentiClimatici: [false]
    });

    this.cerForm.disable();
  }


}
