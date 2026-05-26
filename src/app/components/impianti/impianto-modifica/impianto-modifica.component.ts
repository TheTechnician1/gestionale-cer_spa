import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ImpiantoService } from '../../services/impianto.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { StatoImpianto } from 'src/app/core/enum/stato-impianto.enum';
import { ConfermaDialogComponent } from '../../dati-energetici/dialog/dialog.component';
import { Impianto } from 'src/app/core/interfaces/impianto.model';
import { CerService } from '../../services/cer.service';
import { ConfigurazioneService } from '../../services/configurazione.service';
import { UtenteService } from 'src/app/core/services/utente.service';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';

@Component({
  selector: 'app-impianto-modifica',
  templateUrl: './impianto-modifica.component.html',
  styleUrls: ['./impianto-modifica.component.scss']
})
export class ImpiantiModificaComponent implements OnInit {

  statiImpianto = Object.values(StatoImpianto);
  cerList: any[] = [];
  configurazioniList: any[] = [];
  datiEnergetici: any[] = [];
  isDettaglio: boolean = false;
  impianto: Impianto | null = null;

  form: FormGroup = new FormGroup({
    idImpianto: new FormControl(null),
    idCer: new FormControl(null, Validators.required),
    idConfigurazione: new FormControl(null),
    codiceCabina: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{11}$/)]),
    flgEsercizio: new FormControl(null, Validators.required),
    annoAttivazione: new FormControl(null, Validators.required),
    tipologia: new FormControl(null, Validators.required),
    potenzaNominale: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    flgAccumulo: new FormControl(null, Validators.required),
    capAccumulo: new FormControl(null),
    tipologiaProduttore: new FormControl(null),
    regione: new FormControl(null),
    provincia: new FormControl(null),
    comune: new FormControl(null),
    indirizzo: new FormControl(null),
    civico: new FormControl(null),
    cap: new FormControl(null),
    codiceInstallazione: new FormControl(null),
    specificaInstallazione: new FormControl(null),
    statoImpianto: new FormControl(StatoImpianto.ATTIVO, Validators.required),
    emailUtenteLoggato: new FormControl(null),
    dataUltimaModifica: new FormControl(null),
    utenteUltimaModifica: new FormControl(null)
  });

  constructor(
    private impiantoService: ImpiantoService,
    private toastService: ToastService,
    private cerService: CerService,
    private configurazioneService: ConfigurazioneService,
    private datiEnergeticiService: DatiEnergeticiService,
    private utenteService: UtenteService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form.get('flgAccumulo')?.valueChanges.subscribe(val => {
      const controlloAttivo = this.form.get('capAccumulo');
      if (val === 'SI') {
        controlloAttivo?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        controlloAttivo?.clearValidators();
        controlloAttivo?.reset();
      }
      controlloAttivo?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.cerService.ricercaCer({}).subscribe({
      next: (data) => this.cerList = data.map((c: any) => ({ id: c.idCer, descrizione: c.ragSociale })),
      error: (err) => console.error('Errore caricamento CER', err)
    });

    const path = this.route.snapshot.routeConfig?.path ?? '';
    this.isDettaglio = path.startsWith('dettaglio');

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.impiantoService.getImpianto(+id).subscribe(impianto => {
        this.impianto = impianto;
        this.form.patchValue(impianto);

        this.form.patchValue({
          tipologia: ((impianto as any).codiceTipologia ?? impianto.tipologia)?.toLowerCase(),
          tipologiaProduttore: (impianto as any).codCategoriaProduttore ?? impianto.tipologiaProduttore,
          codiceInstallazione: (impianto as any).codInstallazione ?? null,
          flgAccumulo: (impianto as any).flgAccumulo === 'S' ? 'SI' : 'NO',
          flgEsercizio: (impianto as any).flgEsercizio === 'S' ? 'SI' : 'NO',
        });

        if (impianto.idCer) {
          this.caricaConfigurazioni(impianto.idCer);
        }

        if (this.isDettaglio && impianto.idConfigurazione) {
          this.datiEnergeticiService.getDati({}).subscribe({
            next: (data) => {
              this.datiEnergetici = data.filter(d => d.idConfigurazione === impianto.idConfigurazione);
            },
            error: (err) => console.error('Errore caricamento dati energetici', err)
          });
        }

        console.log('isDettaglio:', this.isDettaglio);
console.log('datiEnergetici:', this.datiEnergetici);

        this.form.get('idImpianto')?.disable();
        this.form.get('idCer')?.disable();
        this.form.get('idConfigurazione')?.disable();

        if (this.isDettaglio) {
          this.form.disable();
        }
      });
    }
  }

  caricaConfigurazioni(idCer: number): void {
  this.configurazioneService.ricercaConfigurazione({ idCer }).subscribe({
    next: (data) => {
      this.configurazioniList = (data ?? []).map((c: any) => ({
        id: c.idConfigurazione,
        descrizione: c.codiceCabina ?? c.ragioneSociale ?? c.idConfigurazione,
        codiceCabina: c.codiceCabina
      }));
    },
    error: (err) => console.error('Errore caricamento configurazioni', err)
  });
}

  submit(): void {
    if (this.form.invalid) {
      this.toastService.error('Campi mancanti o errati');
      return;
    }

   const email = (this.utenteService.currentUser as any)?.utente?.mail ?? '';

    if (!email) {
      this.toastService.error('Utente non autenticato');
      return;
    }

    const payload: Impianto = {
      ...this.impianto!,
      ...this.form.getRawValue(),
      emailUtenteLoggato: email
    };

    this.impiantoService.editImpianto(payload)
      .pipe(
        tap(() => {
          this.toastService.success('Impianto modificato con successo');
          this.router.navigate(['../..'], { relativeTo: this.route });
        }),
        catchError((err) => {
          console.error(err);
          this.toastService.error('Errore durante la modifica impianto');
          return of(null);
        })
      )
      .subscribe();
  }

 apriDettaglioDati(idDati: number): void {
  this.router.navigate(['/dati-energetici/dettaglio-dati', idDati]);
}

  elimina(): void {
    if (!this.impianto) return;

    const dialogRef = this.dialog.open(ConfermaDialogComponent, {
      width: '400px',
      data: { codiceCabina: this.impianto.codiceCabina }
    });

    dialogRef.afterClosed().subscribe((confermato: boolean) => {
      if (confermato) {
        this.impiantoService.deleteImpianto(this.impianto!)
          .subscribe(() => {
            this.toastService.success('Impianto eliminato con successo');
            this.router.navigate(['../..'], { relativeTo: this.route });
          });
      }
    });
  }

  annulla(): void {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }
}