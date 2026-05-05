import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  RegistrazioneCerPayload,
  RegistrazioneCerService,
} from '../core/services/registrazione-cer.service';
import { NotificheService } from '../core/services/notifiche.service';

@Component({
  selector: 'app-registrazione-cer',
  templateUrl: './registrazione-cer.component.html',
  styleUrls: ['./registrazione-cer.component.scss']
})
export class RegistrazioneCerComponent {
  formRegistrazioneCer: FormGroup;
  ultimoPayloadInviato: RegistrazioneCerPayload | null = null;
  rispostaBackend: string | null = null;
  salvataggioInCorso = false;
  readonly formaGiuridicaAltro = this.registrazioneCerService.formaGiuridicaAltro;

  elencoFormaGiuridica: string[] = [
    'Associazione',
    'Associazione riconosciuta',
    'Cooperativa',
    'Consorzio',
    'Fondazione di partecipazione',
    this.registrazioneCerService.formaGiuridicaAltro,
  ];

  elencoRegioni: string[] = [
    'Abruzzo',
    'Basilicata',
    'Calabria',
    'Campania',
    'Emilia-Romagna',
    'Friuli-Venezia Giulia',
    'Lazio',
    'Liguria',
    'Lombardia',
    'Marche',
    'Molise',
    'Piemonte',
    'Puglia',
    'Sardegna',
    'Sicilia',
    'Toscana',
    'Trentino-Alto Adige',
    'Umbria',
    'Valle d Aosta',
    'Veneto',
  ];

  private snackBar = inject(MatSnackBar);

  constructor(
    private registrazioneCerService: RegistrazioneCerService,
    private notificheService: NotificheService
  ) {
    this.formRegistrazioneCer =
      this.registrazioneCerService.creaFormRegistrazioneCer();

    this.codiceFiscale.valueChanges.subscribe((value) =>
      this.maiuscolo(this.codiceFiscale, value)
    );
    this.provinciaSedeLegale.valueChanges.subscribe((value) =>
      this.maiuscolo(this.provinciaSedeLegale, value)
    );
    this.formaGiuridica.valueChanges.subscribe(() => this.aggiornaValidazioneSpecForma());
    this.aggiornaValidazioneSpecForma();
  }

  get ragioneSociale(): FormControl {
    return this.formRegistrazioneCer.get('ragioneSociale') as FormControl;
  }

  get codiceFiscale(): FormControl {
    return this.formRegistrazioneCer.get('codiceFiscale') as FormControl;
  }

  get partitaIVA(): FormControl {
    return this.formRegistrazioneCer.get('partitaIVA') as FormControl;
  }

  get formaGiuridica(): FormControl {
    return this.formRegistrazioneCer.get('formaGiuridica') as FormControl;
  }

  get specFormaGiuridica(): FormControl {
    return this.formRegistrazioneCer.get('specFormaGiuridica') as FormControl;
  }

  get mostraSpecFormaGiuridica(): boolean {
    return this.formaGiuridica.value === this.formaGiuridicaAltro;
  }

  get referente(): FormControl {
    return this.formRegistrazioneCer.get('referente') as FormControl;
  }

  get comuneSedeLegale(): FormControl {
    return this.formRegistrazioneCer.get('comuneSedeLegale') as FormControl;
  }

  get provinciaSedeLegale(): FormControl {
    return this.formRegistrazioneCer.get('provinciaSedeLegale') as FormControl;
  }

  get regioneLegale(): FormControl {
    return this.formRegistrazioneCer.get('regioneLegale') as FormControl;
  }

  get telefono(): FormControl {
    return this.formRegistrazioneCer.get('telefono') as FormControl;
  }

  get email(): FormControl {
    return this.formRegistrazioneCer.get('email') as FormControl;
  }

  get pec(): FormControl {
    return this.formRegistrazioneCer.get('pec') as FormControl;
  }

  get sitoWeb(): FormControl {
    return this.formRegistrazioneCer.get('sitoWeb') as FormControl;
  }

  inviaModulo(formDirective: FormGroupDirective): void {
    if (this.formRegistrazioneCer.pending) {
      return;
    }

    if (this.formRegistrazioneCer.invalid) {
      this.formRegistrazioneCer.markAllAsTouched();
      this.mostraMessaggio('Correggi i campi evidenziati prima di salvare.', 4000);
      return;
    }

    const payload =
      this.registrazioneCerService.normalizzaPayload(this.formRegistrazioneCer);

    this.salvataggioInCorso = true;
    this.ultimoPayloadInviato = payload;

    this.registrazioneCerService.registraCer(payload).subscribe({
      next: (risposta) => {
        this.rispostaBackend = risposta;
        this.notificheService.notificaAdmin(
          'CER inserita',
          `Inserita CER ${payload.ragioneSociale}.`
        );
        this.mostraMessaggio(risposta || 'CER registrata con successo.', 3000);

        formDirective.resetForm();
        this.formRegistrazioneCer.reset();
        this.aggiornaValidazioneSpecForma();
        this.salvataggioInCorso = false;
      },
      error: (errore) => {
        const messaggioErrore =
          errore?.error ||
          'Errore durante la registrazione della CER.';

        this.rispostaBackend = messaggioErrore;
        this.salvataggioInCorso = false;
        this.mostraMessaggio(messaggioErrore, 5000);
      },
    });
  }

  private mostraMessaggio(messaggio: string, durata: number): void {
    this.snackBar.open(messaggio, 'Chiudi', {
      duration: durata,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  private aggiornaValidazioneSpecForma(): void {
    if (this.mostraSpecFormaGiuridica) {
      this.specFormaGiuridica.setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      this.specFormaGiuridica.clearValidators();
      this.specFormaGiuridica.setValue('', { emitEvent: false });
    }

    this.specFormaGiuridica.updateValueAndValidity({ emitEvent: false });
  }

  private maiuscolo(control: FormControl, value: unknown): void {
    if (typeof value !== 'string') {
      return;
    }

    const normalizzato = value.toUpperCase();
    if (value !== normalizzato) {
      control.setValue(normalizzato, { emitEvent: false });
    }
  }

}
