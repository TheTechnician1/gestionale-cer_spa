import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CERService } from '../../services/cer.service';
import { CER } from '../../interfaces/cer.model';
import { ActivatedRoute } from '@angular/router';
import { ConfigurazioneService } from '../../services/configurazione.service';

@Component({
  selector: 'app-inserimento-configurazione',
  templateUrl: './inserimento-configurazione.component.html',
  styleUrls: ['./inserimento-configurazione.component.scss'],
})
export class InserimentoConfigurazioneComponent implements OnInit {
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private cerService: CERService, private configurazioneService: ConfigurazioneService, private route: ActivatedRoute) {}
    cer?: CER;
    cers : CER [] = [];
    configForm!: FormGroup;
    submitted = false;

  ngOnInit() {
    this.configForm = this.fb.group({
      codiceCabina: ['', [Validators.required]],
      annoAttivazione: ['', [Validators.required]],
      ragSociale: ['', [Validators.required]]
    });
    this.configForm.enable();
    this.loadCERS();
  }

  loadCERS() {
    const payload = { ...this.configForm.value };
    this.cerService.getCERS(payload).subscribe({
      next: (cers) => {
        this.cers = cers;
        if (cers.length > 0) {
          this.cer = cers[0];

          this.configForm.patchValue({
            ragSociale: this.cer.ragSociale
          });
        }
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }

  submit() {
    this.submitted = true;

    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();

      this.snackBar.open(
        'Compila tutti i campi obbligatori correttamente',
        'Chiudi',
        { duration: 3000 }
      );
      return;
    }

    this.configurazioneService.createConfigurazione(this.configForm.value).subscribe({
      next: (res) => {
        this.snackBar.open(
          'Configurazione inserita!',
          'OK',
          { duration: 2000 }
        );
        console.log('Salvato:', res);

        this.configForm.reset();
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
