import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dettaglio-dati-energetici',
  templateUrl: './dettaglio-dati-energetici.component.html',
  styleUrls: ['./dettaglio-dati-energetici.component.scss']
})
export class DettaglioDatiEnergeticiComponent implements OnInit {

  datiEnergeticiForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.datiEnergeticiForm = this.fb.group({
     id_cer: ['', [Validators.required]],
     id_config: ['', [Validators.required]],
     anno: ['', [Validators.required]],
     energia_prodotta: ['', [Validators.required]],
     energia_prelevata: ['', [Validators.required]],
     energia_immessa: ['', [Validators.required]],
     energia_condivisa: ['', [Validators.required]],
     energia_autoconsumata: ['', [Validators.required]],
     tariffa_premio: ['', [Validators.required]],
     corrispettivo_premio: ['', [Validators.required]],
     riduzione_emissione: ['', [Validators.required]]
    });
    this.datiEnergeticiForm.disable();
  }
}
