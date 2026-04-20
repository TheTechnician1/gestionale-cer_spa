import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modifica-configurazione',
  templateUrl: './modifica-configurazione.component.html',
  styleUrls: ['./modifica-configurazione.component.scss']
})
export class ModificaConfigurazioneComponent implements OnInit {

  configForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.configForm = this.fb.group({
      codice_cabina: ['', [Validators.required]],
      anno_attivazione: ['', [Validators.required]]
    });
    this.configForm.enable();
  }
}
