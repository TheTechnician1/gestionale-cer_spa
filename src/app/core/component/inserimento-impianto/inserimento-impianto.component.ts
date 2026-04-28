import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CERService } from '../../services/cer.service';
import { ConfigurazioneService } from '../../services/configurazione.service';
import { CER } from '../../interfaces/cer.model';
import { ActivatedRoute } from '@angular/router';
import { ImpiantoService } from '../../services/impianto.service';
import { Configurazione } from '../../interfaces/configurazione.model';

@Component({
  selector: 'app-inserimento-impianto',
  templateUrl: './inserimento-impianto.component.html',
  styleUrls: ['./inserimento-impianto.component.scss']
})
export class InserimentoImpiantoComponent implements OnInit {

  impiantiForm!: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private cerService: CERService, private configService: ConfigurazioneService, private configurazioneService: ConfigurazioneService, private impiantoService: ImpiantoService, private route: ActivatedRoute) {}
    cer?: CER;
    cers: CER[] = [];
    config?: Configurazione;
    configs: Configurazione[] = [];
    submitted = false;

  ngOnInit(): void {
    this.impiantiForm = this.fb.group({
    ragSociale: ['', Validators.required],
    codiceCabina: ['', [Validators.required]],
    idCer: ['', [Validators.required]],
    idConfig: ['', [Validators.required]],
    dataEserc: ['', [Validators.required]],
    codiceTipologia: ['', [Validators.required]],
    potenzaNominale: ['', [Validators.required]],
    flgAccumulo: ['', [Validators.required]],
    capAccumulo: ['', [Validators.required]],
    tipoProduttore: ['', [Validators.required]],
    codCategoriaProduttore: ['', [Validators.required]],
    regione: ['', [Validators.required]],
    provincia: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    comune: ['', [Validators.required]],
    indirizzo: ['', [Validators.required]],
    civico: ['', [Validators.required]],
    cap: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    specTipoInst: ['', [Validators.required]]
    });
    this.impiantiForm.enable();
    this.loadCERS();
    this.loadConfigs();
  }

  loadCERS() {
    const payload = { ...this.impiantiForm.value };
    this.cerService.getCERS(payload).subscribe({
      next: (cers) => {
        this.cers = cers;
        if (cers.length > 0) {
          this.cer = cers[0];

          this.impiantiForm.patchValue({
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
    const payload = { ...this.impiantiForm.value };
    this.configService.getConfigurazioni(payload).subscribe({
      next: (configs) => {
        this.configs = configs;
        if (configs.length > 0) {
          this.config = configs[0];

          this.impiantiForm.patchValue({
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

    if (this.impiantiForm.invalid) {
      this.impiantiForm.markAllAsTouched();

      this.snackBar.open(
        'Compila tutti i campi obbligatori correttamente',
        'Chiudi',
        { duration: 3000 }
      );
      return;
    }

    this.impiantoService.createImpianto(this.impiantiForm.value).subscribe({
      next: (res) => {
        this.snackBar.open(
          'Inserimento completato!',
          'OK',
          { duration: 2000 }
        );
        console.log('Salvato:', res);

        this.impiantiForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error(err);

        this.snackBar.open(
          'Errore durante il salvataggio',
          'Chiudi',
          { duration: 3000 }
        );
      }
    });
  }
}
