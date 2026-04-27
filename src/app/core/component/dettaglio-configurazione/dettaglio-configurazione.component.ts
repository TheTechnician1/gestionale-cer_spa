import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurazioneService } from '../../services/configurazione.service';
import { Configurazione } from '../../interfaces/configurazione.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dettaglio-configurazione',
  templateUrl: './dettaglio-configurazione.component.html',
  styleUrls: ['./dettaglio-configurazione.component.scss']
})
export class DettaglioConfigurazioneComponent implements OnInit {
  constructor(private fb: FormBuilder, private configService: ConfigurazioneService, private route: ActivatedRoute) {}

  config?: Configurazione;
  configForm!: FormGroup;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.configForm = this.fb.group({
      codiceCabina: ['', [Validators.required]],
      annoAttivazione: ['', [Validators.required]],
      ragioneSociale: ['']
    });
    this.configForm.disable();
    this.loadConfig(parseInt(id!));
  }

  loadConfig(id: number) {
    this.configService.getConfigurazione(id).subscribe({
      next: (config) => {
      this.config = config[0];

      if(this.configForm) {
        this.configForm.patchValue({
          codiceCabina: this.config.codiceCabina,
          annoAttivazione: this.config.annoAttivazione,
          ragioneSociale: this.config.cer?.ragioneSociale
        })
      }
      },
      error: (error) => {
        console.error("Errore imprevisto: ", error);
      }
    });
  }
}
