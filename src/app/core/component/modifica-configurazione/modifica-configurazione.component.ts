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
    this.loadConfig(parseInt(id!));
    this.configForm = this.fb.group({
      codiceCabina: ['', [Validators.required]],
      annoAttivazione: ['', [Validators.required]]
    });
    this.loadConfig(parseInt(id!));
    this.configForm.enable();
  }

  loadConfig(id: number) {
    this.configService.getConfigurazione(id).subscribe({
      next: (config) => {
      console.log("Peppeeeee", config);
      this.config = config;
      this.configForm.patchValue(config);
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

  submit() {
    this.submitted = true;
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      this.snackBar.open('Compila tutti i campi obbligatori correttamente');
      console.log(this.configForm);
      return;
    }
    const payload = { ...this.configForm.value, id: this.config.idConfigurazione }
    this.editConfig(payload);
  }
}
