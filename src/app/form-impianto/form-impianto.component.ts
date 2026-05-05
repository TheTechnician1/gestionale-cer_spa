import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImpiantoService } from '../core/services/impianto.service';
import { ConfigurazioneCabina } from '../core/interfaces/user.model';
import { ConfigurazioneCabinaService } from '../core/services/configurazione-cabina.service';

@Component({
  selector: 'app-form-impianto',
  templateUrl: './form-impianto.component.html',
  styleUrls: ['./form-impianto.component.scss'],
})
export class FormImpiantoComponent implements OnInit {
  formImpianto: FormGroup;
  idImpianto: number | null = null;
  salvataggioInCorso = false;
  caricamento = false;
  configurazioniDisponibili: ConfigurazioneCabina[] = [];

  readonly tipologie = [
    'Fotovoltaico',
    'Agrivoltaico',
    'Eolico on-shore',
    'Eolico off-shore',
    'Idroelettrico',
    'Biomassa',
    'Biogas',
  ];

  readonly categorieProduttore = [
    'Persona fisica',
    'Piccola/media impresa',
    'Comune',
    'Unioni di comuni',
    'Province/citta metropolitane',
    'Aziende sanitarie locali',
    'Altre pubbliche amministrazioni',
    'Enti del terzo settore',
    'Altri soggetti',
  ];

  readonly tipologieSito = [
    'Su terreno',
    'Su terreno agricolo',
    'Su edificio',
    'Su superficie impermeabilizzata',
    'Flottante',
  ];

  constructor(
    private impiantoService: ImpiantoService,
    private configurazioneService: ConfigurazioneCabinaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.formImpianto = this.impiantoService.creaFormImpianto();
  }

  ngOnInit(): void {
    this.caricaConfigurazioniDisponibili();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.idImpianto = id || null;

    if (!this.idImpianto) {
      return;
    }

    this.caricamento = true;
    this.impiantoService.visualizza(this.idImpianto).subscribe({
      next: (impianto) => {
        this.impiantoService.popolaForm(this.formImpianto, impianto);
        this.caricamento = false;
      },
      error: (errore) => {
        this.caricamento = false;
        this.mostraMessaggio(errore?.error || 'Impianto non trovato.');
        this.router.navigateByUrl('/impianti');
      },
    });
  }

  get modifica(): boolean {
    return !!this.idImpianto;
  }

  get titolo(): string {
    return this.modifica ? 'Modifica impianto' : 'Nuovo impianto';
  }

  inviaModulo(): void {
    if (this.formImpianto.invalid) {
      this.formImpianto.markAllAsTouched();
      this.mostraMessaggio('Correggi i campi evidenziati prima di salvare.');
      return;
    }

    if (!this.modifica && !this.impiantoService.puoInserire()) {
      this.mostraMessaggio('Non hai i permessi per inserire un impianto.');
      return;
    }

    if (this.modifica && !this.impiantoService.puoModificare()) {
      this.mostraMessaggio('Non hai i permessi per modificare un impianto.');
      return;
    }

    this.salvataggioInCorso = true;
    const richiesta = this.modifica
      ? this.impiantoService.modifica(this.impiantoService.normalizzaModifica(this.formImpianto))
      : this.impiantoService.inserisci(this.impiantoService.normalizzaInserimento(this.formImpianto));

    richiesta.subscribe({
      next: (risposta) => {
        this.salvataggioInCorso = false;
        this.mostraMessaggio(risposta || 'Operazione completata con successo.');
        this.router.navigateByUrl('/impianti');
      },
      error: (errore) => {
        this.salvataggioInCorso = false;
        this.mostraMessaggio(errore?.error || 'Errore durante il salvataggio dell impianto.');
      },
    });
  }

  campo(nome: string): FormControl {
    return this.formImpianto.get(nome) as FormControl;
  }

  codiceCabinaConfigurazione(configurazione: ConfigurazioneCabina): string {
    return this.configurazioneService.codiceCabina(configurazione);
  }

  idConfigurazione(configurazione: ConfigurazioneCabina): number | null {
    return this.configurazioneService.idConfigurazione(configurazione);
  }

  aggiornaConfigurazioneSelezionata(idConfigurazione: number): void {
    const configurazione = this.configurazioniDisponibili.find(
      (item) => this.configurazioneService.idConfigurazione(item) === idConfigurazione
    );

    if (!configurazione) {
      return;
    }

    this.formImpianto.patchValue({
      codiceCabina: this.codiceCabinaConfigurazione(configurazione),
      partitaIva: configurazione.cer?.partitaIVA ?? this.campo('partitaIva').value,
    });
  }

  private caricaConfigurazioniDisponibili(): void {
    this.configurazioneService.ricerca().subscribe({
      next: (configurazioni) => {
        this.configurazioneService.arricchisciConDettaglio(configurazioni).subscribe({
          next: (dettagli) => {
            this.configurazioniDisponibili = dettagli.filter(
              (configurazione) =>
                !!this.configurazioneService.idConfigurazione(configurazione) &&
                !this.configurazioneService.configurazioneDisattiva(configurazione)
            );
          },
          error: () => {
            this.configurazioniDisponibili = configurazioni.filter(
              (configurazione) =>
                !!this.configurazioneService.idConfigurazione(configurazione) &&
                !this.configurazioneService.configurazioneDisattiva(configurazione)
            );
          },
        });
      },
      error: () => {
        this.configurazioniDisponibili = [];
      },
    });
  }

  private mostraMessaggio(messaggio: string): void {
    this.snackBar.open(messaggio, 'Chiudi', {
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
