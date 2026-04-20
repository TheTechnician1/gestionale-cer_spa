import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dettaglio-configurazione',
  templateUrl: './dettaglio-configurazione.component.html',
  styleUrls: ['./dettaglio-configurazione.component.scss']
})
export class DettaglioConfigurazioneComponent implements OnInit {

  configForm!: FormGroup;
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.configForm = this.fb.group({
      codice_cabina: ['', [Validators.required]],
      anno_attivazione: ['', [Validators.required]]
    });
    this.configForm.disable();
  }
}
