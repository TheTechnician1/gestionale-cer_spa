import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Configurazione } from '../../interfaces/configurazione.model';
import { ConfigurazioneService } from '../../services/configurazione.service';

@Component({
  selector: 'app-modifica-configurazione',
  templateUrl: './modifica-configurazione.component.html',
  styleUrls: ['./modifica-configurazione.component.scss']
})
export class ModificaConfigurazioneComponent implements OnInit {
  constructor(private fb: FormBuilder, private configService: ConfigurazioneService, private snackBar: MatSnackBar, private route: ActivatedRoute) {}
  config!: Configurazione;
  configForm!: FormGroup;
  submitted = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.configForm = this.fb.group({
      codiceCabina: ['', [Validators.required]],
      annoAttivazione: ['', [Validators.required]],
      ragioneSociale: ['']
    });
    this.configForm.enable();
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
          ragioneSociale: this.config.cer?.ragSociale
        })
      }
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }

  editConfig(payload: any) {
    this.configService.editConfigurazione(payload).subscribe({
      next: (res) => {
        this.snackBar.open('Modifica completata!');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteConfig() {
    const id = { ...this.configForm.value, id: this.config.idConfigurazione };
    this.configService.deleteConfigurazione(id).subscribe({
      next: (res) => {
        this.snackBar.open('Elimina completata!');
      },
      error: (err) => {
        console.log(err);
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
    this.snackBar.open(
      'Inserimento completato!',
      'OK',
      { duration: 2000 }
    );
    console.log(this.configForm.value);
    const payload = { ...this.configForm.value, id: this.config.idConfigurazione }
    this.editConfig(payload);
  }
}
