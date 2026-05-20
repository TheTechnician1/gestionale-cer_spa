import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImpiantoService } from '../../services/impianto.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Impianto } from "src/app/core/interfaces/impianto.model";
import { StatoImpianto } from "src/app/core/enum/stato-impianto.enum";
import { ToastService } from "src/app/core/services/toast.service";

@Component({
  selector: "app-impianti-form",
  templateUrl: "./impianti-form.component.html",
  styleUrls: ["./impianti-form.component.scss"],
})
export class ImpiantiFormComponent implements OnInit, OnChanges {

  statiImpianto = Object.values(StatoImpianto);
  cerList: Cer[] = [];

  @Input() impianto: Impianto | null = null;
  isEditMode: boolean = false;

  @Output() formChiuso = new EventEmitter<void>();

  chiudiForm(): void {
  this.formChiuso.emit();
}

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
    statoImpianto: new FormControl(StatoImpianto.ATTIVO, Validators.required),
    emailUtenteLoggato: new FormControl(null, [Validators.required, Validators.email]),
    dataUltimaModifica: new FormControl(null),
    utenteUltimaModifica: new FormControl(null)
  });

  constructor(private impiantoService: ImpiantoService,
              private toastService: ToastService)
               
  {
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
      { id: 1, descrizione: "CER Napoli" },
      { id: 2, descrizione: "CER Milano" },
      { id: 3, descrizione: "CER Roma"   }
    ];

    this.inizializzaForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['impianto']) {
      this.inizializzaForm();
    }
  }

  private inizializzaForm(): void {
    this.form.reset({ statoImpianto: StatoImpianto.ATTIVO });

    this.form.get('idImpianto')?.enable();
    this.form.get('idCer')?.enable();
    this.form.get('idConfigurazione')?.enable();

    if (this.impianto) {
      this.isEditMode = true;
      this.form.patchValue(this.impianto);

      this.form.get('idImpianto')?.disable();
      this.form.get('idCer')?.disable();
      this.form.get('idConfigurazione')?.disable();
    } else {
      this.isEditMode = false;
    }
  }

   submit(): void {
    if (this.form.invalid) {
     // this.form.markAllAsTouched();
       this.toastService.error('campi mancanti o errati');
      return;
    }

    const payload = this.form.getRawValue();

    if (this.isEditMode) {
      payload.dataUltimaModifica = new Date();
      payload.utenteUltimaModifica = this.form.get('emailUtenteLoggato')?.value;

      this.impiantoService.editImpianto(payload)
        .pipe(
          tap(() => {
           this.toastService.success('Impianto modificato con successo');
            this.formChiuso.emit();
          }),
          catchError(() => {
           this.toastService.error('Errore durante la modifica dell\'impianto');
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.impiantoService.createImpianto(payload)
        .pipe(
          tap(() => {
          this.toastService.success('Impianto creato con successo');
            this.formChiuso.emit();
          }),
          catchError(() => {
            this.toastService.error('Errore durante la creazione dell\'impianto');
            return of(null);
          })
        )
        .subscribe();
    }
  }
}

interface Cer {
  id: number;
  descrizione: string;
}




