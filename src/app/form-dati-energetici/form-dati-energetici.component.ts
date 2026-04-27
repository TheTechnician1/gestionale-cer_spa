import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatiEnergeticiService } from '../core/services/dati-energetici.service';
import { NotificheService } from '../core/services/notifiche.service';

@Component({
  selector: 'app-form-dati-energetici',
  templateUrl: './form-dati-energetici.component.html',
  styleUrls: ['./form-dati-energetici.component.scss'],
})
export class FormDatiEnergeticiComponent implements OnInit {
  formDatiEnergetici: FormGroup;
  idDati: number | null = null;
  salvataggioInCorso = false;
  caricamento = false;

  readonly statiScheda = ['Active', 'Disabled'];

  constructor(
    private datiEnergeticiService: DatiEnergeticiService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private notificheService: NotificheService
  ) {
    this.formDatiEnergetici = this.datiEnergeticiService.creaFormDatiEnergetici();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.idDati = id || null;
    this.configuraCalcoloAutomaticoCo2();

    if (!this.idDati) {
      return;
    }

    this.caricamento = true;
    this.datiEnergeticiService.visualizza(this.idDati).subscribe({
      next: (dati) => {
        this.datiEnergeticiService.popolaForm(this.formDatiEnergetici, dati);
        this.caricamento = false;
      },
      error: (errore) => {
        this.caricamento = false;
        this.mostraMessaggio(errore?.error || 'Scheda energetica non trovata.');
        this.router.navigateByUrl('/dati-energetici');
      },
    });
  }

  get modifica(): boolean {
    return !!this.idDati;
  }

  get titolo(): string {
    return this.modifica ? 'Modifica dati energetici' : 'Nuovi dati energetici annuali';
  }

  inviaModulo(): void {
    if (this.formDatiEnergetici.get('calcoloCo2Automatico')?.value) {
      this.aggiornaRiduzioneCo2();
    }

    if (this.formDatiEnergetici.invalid) {
      this.formDatiEnergetici.markAllAsTouched();
      this.mostraMessaggio('Correggi i campi evidenziati prima di salvare.');
      return;
    }

    if (!this.modifica && !this.datiEnergeticiService.puoInserire()) {
      this.mostraMessaggio('Non hai i permessi per inserire dati energetici.');
      return;
    }

    if (this.modifica && !this.datiEnergeticiService.puoModificare()) {
      this.mostraMessaggio('Non hai i permessi per modificare dati energetici.');
      return;
    }

    this.salvataggioInCorso = true;
    const payload = this.datiEnergeticiService.normalizzaSalvataggio(this.formDatiEnergetici);
    const richiesta = this.modifica
      ? this.datiEnergeticiService.modifica(payload)
      : this.datiEnergeticiService.inserisci(payload);

    richiesta.subscribe({
      next: (risposta) => {
        this.salvataggioInCorso = false;
        this.notificheService.notificaAdmin(
          this.modifica ? 'Dati energetici modificati' : 'Dati energetici inseriti',
          `${this.modifica ? 'Modificata' : 'Inserita'} scheda energetica ${payload.anno} per configurazione ${payload.idConfigurazione}.`
        );
        this.mostraMessaggio(risposta || 'Operazione completata con successo.');
        this.router.navigateByUrl('/dati-energetici');
      },
      error: (errore) => {
        this.salvataggioInCorso = false;
        this.mostraMessaggio(errore?.error || 'Errore durante il salvataggio dei dati energetici.');
      },
    });
  }

  campo(nome: string): FormControl {
    return this.formDatiEnergetici.get(nome) as FormControl;
  }

  aggiornaRiduzioneCo2(): void {
    this.formDatiEnergetici.patchValue({
      ridEmCo2: this.datiEnergeticiService.calcolaRiduzioneCo2(this.formDatiEnergetici),
    });
  }

  private configuraCalcoloAutomaticoCo2(): void {
    this.formDatiEnergetici.get('calcoloCo2Automatico')?.valueChanges.subscribe((automatico) => {
      const riduzione = this.formDatiEnergetici.get('ridEmCo2');

      if (automatico) {
        this.aggiornaRiduzioneCo2();
        riduzione?.disable({ emitEvent: false });
      } else {
        riduzione?.enable({ emitEvent: false });
      }
    });

    this.formDatiEnergetici.get('geteProdotta')?.valueChanges.subscribe(() => {
      if (this.formDatiEnergetici.get('calcoloCo2Automatico')?.value) {
        this.aggiornaRiduzioneCo2();
      }
    });

    this.formDatiEnergetici.get('fattoreEmissioneCo2')?.valueChanges.subscribe(() => {
      if (this.formDatiEnergetici.get('calcoloCo2Automatico')?.value) {
        this.aggiornaRiduzioneCo2();
      }
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
