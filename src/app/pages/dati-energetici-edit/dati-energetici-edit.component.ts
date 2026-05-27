import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatiEnergeticiService } from 'src/app/components/services/dati-energetici.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { DatiEnergeticiView } from 'src/app/core/interfaces/dati-energetici-view';
import { DatiEnergeticiModel } from 'src/app/core/interfaces/dati-energetici.model';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { CerView } from 'src/app/core/interfaces/cer.model';
import { ConfigurazioneView } from 'src/app/core/interfaces/configurazione.model';
import { CerService } from 'src/app/components/services/cer.service';
import { ConfigurazioniService } from 'src/app/components/services/configurazioni.service';

@Component({
  selector: 'app-dati-energetici-edit',
  templateUrl: './dati-energetici-edit.component.html',
})
export class DatiEnergeticiEditComponent implements OnInit {
  id?: number;
  form!: FormGroup;

  cerList$?: Observable<CerView[]>;
  configurazioniList$?: Observable<ConfigurazioneView[]>;

  editedDati$: Observable<DatiEnergeticiView> | undefined;
  idEdit = 0;

  constructor(
    private route: ActivatedRoute,
    private service: DatiEnergeticiService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private cerService: CerService,
    private configurazioniService: ConfigurazioniService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idSchedaEnergetica: [''],
      idCer: [''],
      idConfigurazione: [''],
      annoRiferimento: [''],
      energiaProdottaMhw: [''],
      energiaPrelevataMhw: [''],
      energiaImmessaMhw: [''],
      energiaCondivisaMhw: [''],
      energiaAutoconsumataMhw: [''],
      tariffaPremioEuro: [''],
      corrispettivoPremioEuro: [''],
      riduzioneCo2Ton: [''],
      calcoloCo2Automatico: [''],
      note: [''],
      attivo: [{ value: '', disabled: true }],
      emailUtenteLoggato: [''],
    });

    this.cerList$ = this.cerService.getAllCer();
    this.form.get('idCer')?.valueChanges.subscribe((idCer) => {
      this.configurazioniList$ = of([]);
      this.form.get('idCabina')?.setValue(null);
      this.form.get('idCabina')?.disable({ emitEvent: false });
      if (idCer) {
        this.configurazioniList$ = this.configurazioniService
          .getAllConfigurazione()
          .pipe(
            map((imp) => imp.filter((i) => i.idCer === idCer)),
            tap((x) =>
              x.forEach((y) => console.log('cabina:' + y.codiceCabina)),
            ),
          );
        this.configurazioniList$.subscribe({
          next: (x) => {
            if (x && x.length > 0) {
              this.form.get('idCabina')?.enable({ emitEvent: false });
            }
          },
        });
      } else {
        this.configurazioniList$ = of([]);
      }
    });
    this.form.valueChanges.pipe(debounceTime(500), distinctUntilChanged());

    this.idEdit = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.idEdit) {
      return;
    }

    this.editedDati$ = this.service.getDato(this.idEdit);
    if (!this.editedDati$) {
      alert('Impianto non trovato');
      this.router.navigate(['/dati-energetici']);
    }

    this.editedDati$.subscribe({
      next: (x) => {
        this.form.patchValue({
          idSchedaEnergetica: x.idSchedaEnergetica,
          idCer: x.idCer,
          idConfigurazione: x.idConfigurazione,
          annoRiferimento: x.annoRiferimento,
          energiaProdottaMhw: x.energiaProdottaMhw,
          energiaPrelevataMhw: x.energiaPrelevataMhw,
          energiaImmessaMhw: x.energiaImmessaMhw,
          energiaCondivisaMhw: x.energiaCondivisaMhw,
          energiaAutoconsumataMhw: x.energiaAutoconsumataMhw,
          tariffaPremioEuro: x.tariffaPremioEuro,
          corrispettivoPremioEuro: x.corrispettivoPremioEuro,
          riduzioneCo2Ton: x.riduzioneCo2Ton,
          calcoloCo2Automatico: x.calcoloCo2Automatico,
          note: x.note,
          attivo: x.attivo,
          emailUtenteLoggato: x.emailUtenteLoggato,
        });
      },
    });
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.id || isNaN(this.id)) {
      console.warn('ID non valido');
      this.router.navigate(['/dati-energetici']);
      return;
    }

    this.service.getDato(this.id).subscribe({
      next: (res: DatiEnergeticiView) => {
        console.log('EDIT DATA:', res);

        this.form.patchValue({
          idSchedaEnergetica: res.idSchedaEnergetica,
          annoRiferimento: res.annoRiferimento,
          idCer: res.idCer,
          idConfigurazione: res.idConfigurazione,

          energiaProdottaMhw: res.energiaProdottaMhw,
          energiaPrelevataMhw: res.energiaPrelevataMhw,
          energiaImmessaMhw: res.energiaImmessaMhw,
          energiaAutoconsumataMhw: res.energiaAutoconsumataMhw,

          tariffaPremioEuro: res.tariffaPremioEuro,
          corrispettivoPremioEuro: res.corrispettivoPremioEuro,

          riduzioneCo2Ton: res.riduzioneCo2Ton,

          note: res.note,
          attivo: res.attivo,
          emailUtenteLoggato: res.emailUtenteLoggato,
        });
      },
      error: (err) => {
        console.error('Errore caricamento edit', err);
      },
    });
  }

  salvaModifica(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    this.service.putDato(this.id, payload).subscribe({
      next: () => {
        this.toastService.success('✅ Modifiche salvate con successo');

        this.router.navigate(['/dati-energetici']);
      },

      error: (err) => {
        console.error('Errore salvataggio', err);

        this.toastService.error('❌ Errore durante il salvataggio');
      },
    });
  }

  back(): void {
    this.router.navigate(['/dati-energetici']);
  }
}
