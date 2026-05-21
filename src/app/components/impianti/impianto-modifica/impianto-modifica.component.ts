import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ImpiantoService } from '../../services/impianto.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { StatoImpianto, } from 'src/app/core/enum/stato-impianto.enum';
import { ConfermaDialogComponent} from '../../dati-energetici/dialog/dialog.component';
import { Impianto } from 'src/app/core/interfaces/impianto.model';

interface Cer {
  id: number;
  descrizione: string;
}

@Component({
  selector: 'app-impianto-modifica',
  templateUrl: './impianto-modifica.component.html',
  styleUrls: ['./impianto-modifica.component.scss']
})
export class ImpiantiModificaComponent implements OnInit {

  statiImpianto = Object.values(StatoImpianto);
  cerList: Cer[] = [];
  isDettaglio: boolean = false;
  impianto: Impianto | null = null;

  form: FormGroup = new FormGroup({
    idImpianto: new FormControl(null),
    idCer: new FormControl(null, Validators.required),
    idConfigurazione: new FormControl(null, Validators.required),
    codiceCabina: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{11}$/)]),
    flgEsercizio: new FormControl(null, Validators.required),
    annoAttivazione: new FormControl(null, Validators.required),
    tipologia: new FormControl(null, Validators.required),
    potenzaNominale: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    flgAccumulo: new FormControl(null, Validators.required),
    capAccumulo: new FormControl(null),
    tipologiaProduttore: new FormControl(null, Validators.required),
    regione: new FormControl(null, Validators.required),
    provincia: new FormControl(null, Validators.required),
    comune: new FormControl(null, Validators.required),
    indirizzo: new FormControl(null, Validators.required),
    civico: new FormControl(null, Validators.required),
    cap: new FormControl(null, Validators.required),
    codiceInstallazione: new FormControl(null),
    specificaInstallazione: new FormControl (null),
    statoImpianto: new FormControl(StatoImpianto.ATTIVO, Validators.required),
    emailUtenteLoggato: new FormControl(null, [Validators.required, Validators.email]),
    dataUltimaModifica: new FormControl(null),
    utenteUltimaModifica: new FormControl(null)
  });

  constructor(
    private impiantoService: ImpiantoService,
    private toastService: ToastService,
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
    this.cerList = [
      { id: 1, descrizione: 'CER Napoli' },
      { id: 2, descrizione: 'CER Milano' },
      { id: 3, descrizione: 'CER Roma' }
    ];

    const path = this.route.snapshot.routeConfig?.path ?? '';
    this.isDettaglio = path.startsWith('dettaglio');

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.impiantoService.getImpianto(+id).subscribe(impianto => {
        this.impianto = impianto;
        this.form.patchValue(impianto);

        this.form.get('idImpianto')?.disable();
        this.form.get('idCer')?.disable();
        this.form.get('idConfigurazione')?.disable();

        if (this.isDettaglio) {
          this.form.disable();
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.toastService.error('Campi mancanti o errati');
      return;
    }

    const payload = this.form.getRawValue();
    payload.dataUltimaModifica = new Date();
    payload.utenteUltimaModifica = this.form.get('emailUtenteLoggato')?.value;

    this.impiantoService.editImpianto(payload)
      .pipe(
        tap(() => {
          this.toastService.success('Impianto modificato con successo');
          this.router.navigate(['../..'], { relativeTo: this.route });
        }),
        catchError(() => {
          this.toastService.error('Errore durante la modifica dell\'impianto');
          return of(null);
        })
      )
      .subscribe();
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
