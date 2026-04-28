import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { ConfigurazioneService } from '../../services/configurazione.service';
import { CERService } from '../../services/cer.service';
import { CER } from '../../interfaces/cer.model';
import { Configurazione } from '../../interfaces/configurazione.model';

@Component({
  selector: 'app-inserimento-dati-energetici',
  templateUrl: './inserimento-dati-energetici.component.html',
  styleUrls: ['./inserimento-dati-energetici.component.scss'],
})
export class InserimentoDatiEnergeticiComponent implements OnInit {
  constructor(private fb: FormBuilder, private datiEnergeticiService: DatiEnergeticiService,  private cerService: CERService, private configService: ConfigurazioneService, private snackBar: MatSnackBar) {}

  cer?: CER;
  cers: CER[] = [];
  config?: Configurazione;
  configs: Configurazione[] = [];
  datiEnergeticiForm!: FormGroup;
  submitted = false;

  ngOnInit() {
    this.datiEnergeticiForm = this.fb.group({
      idCer: ['', [Validators.required]],
      idConfig: ['', [Validators.required]],
      ragSociale: ['', Validators.required],
      codiceCabina: ['', [Validators.required]],
      anno: ['', [Validators.required]],
      eProdotta: ['', [Validators.required]],
      ePrelevata: ['', [Validators.required]],
      eImmessa: ['', [Validators.required]],
      eCondivisa: ['', [Validators.required]],
      eAutoCons: ['', [Validators.required]],
      tariffaPremium: ['', [Validators.required]],
      corrPremioOtt: ['', [Validators.required]],
      ridEmCo2: ['', [Validators.required]]
    });
    this.datiEnergeticiForm.enable();
  }

  loadCERS() {
    const payload = { ...this.datiEnergeticiForm.value };
    this.cerService.getCERS(payload).subscribe({
      next: (cers) => {
        this.cers = cers;
        if (cers.length > 0) {
          this.cer = cers[0];

          this.datiEnergeticiForm.patchValue({
            ragSociale: this.cer.ragSociale,
            idCer: this.cer.idCer
          });
        }
      },
      error: (error) => {
        console.error("Errore caricamento CER", error);
      }
    });
  }

  loadConfigs() {
    const payload = { ...this.datiEnergeticiForm.value };
    this.configService.getConfigurazioni(payload).subscribe({
      next: (configs) => {
        this.configs = configs;
        if (configs.length > 0) {
          this.config = configs[0];

          this.datiEnergeticiForm.patchValue({
            codiceCabina: this.config.codiceCabina,
            idConfig: this.config.idConfig
          });
        }
      },
      error: (error) => {
        console.error("Errore caricamento Configurazione", error);
      }
    });
  }

  submit() {
    this.submitted = true;

    if (this.datiEnergeticiForm.invalid) {
      this.datiEnergeticiForm.markAllAsTouched();

      this.snackBar.open(
        'Compila tutti i campi obbligatori correttamente',
        'Chiudi',
        { duration: 3000 }
      );
      return;
    }

    this.datiEnergeticiService.createDatiEnergetici(this.datiEnergeticiForm.value).subscribe({
      next: (res) => {
        this.snackBar.open(
          'Inserimento completato!',
          'OK',
          { duration: 2000 }
        );
        console.log('Salvato:', res);

        this.datiEnergeticiForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error(err);

        this.snackBar.open(
          'Errore durnte il salvataggio',
          'Chiudi',
          { duration: 3000 }
        );
      }
    });
  }
}

