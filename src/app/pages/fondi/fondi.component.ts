import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserResponse } from '../../models/user-response';
import { UtenteStorageService } from '../../services/utente-storage.service';
import { UtenteService } from '../../services/utente.service';

@Component({
  selector: 'app-fondi',
  templateUrl: './fondi.component.html',
  styleUrls: ['./fondi.component.scss'],
})
export class FondiComponent implements OnInit {
  utente: UserResponse | null = null;
  fondiForm: FormGroup;
  caricamento = false;
  messaggioErrore = '';
  messaggioSuccesso = '';

  constructor(
    private formBuilder: FormBuilder,
    private utenteStorageService: UtenteStorageService,
    private utenteService: UtenteService,
  ) {
    this.fondiForm = this.formBuilder.group({
      importo: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.utente = this.utenteStorageService.recuperaUtente();
  }

  aggiungiFondi(): void {
    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    if (this.fondiForm.invalid) {
      this.fondiForm.markAllAsTouched();
      return;
    }

    if (!this.utente) {
      this.messaggioErrore = 'Devi effettuare il login per aggiungere fondi';
      return;
    }

    const importo = Number(this.fondiForm.value.importo);
    this.caricamento = true;

    this.utenteService.aggiungiFondi(this.utente.id, importo).subscribe({
      next: (utenteAggiornato) => {
        this.utente = utenteAggiornato;
        this.utenteStorageService.salvaUtente(utenteAggiornato);
        this.fondiForm.reset();
        this.messaggioSuccesso = 'Fondi aggiunti correttamente';
        this.caricamento = false;
      },
      error: (errore) => {
        this.messaggioErrore =
          errore.error?.messaggio || 'Errore durante aggiunta fondi';
        this.caricamento = false;
      },
    });
  }
}