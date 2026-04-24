import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurazioneService } from '../../services/configurazione.service';
import { Configurazione } from '../../interfaces/configurazione.model';

@Component({
  selector: 'app-dettaglio-configurazione',
  templateUrl: './dettaglio-configurazione.component.html',
  styleUrls: ['./dettaglio-configurazione.component.scss']
})
export class DettaglioConfigurazioneComponent implements OnInit {
  constructor(private fb: FormBuilder, private configService: ConfigurazioneService) {}

  config?: Configurazione;

  configForm!: FormGroup;

  ngOnInit(): void {
    this.loadConfig();
    this.configForm = this.fb.group({
      codiceCabina: ['', [Validators.required]],
      annoAttivazione: ['', [Validators.required]]
    });
    this.configForm.disable();
  }

  loadConfig() {
    console.log(this.config);
    this.configService.getConfigurazione(this.config!.idConfigurazione).subscribe({
      next: (config) => {
      this.config = config;
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }
}
