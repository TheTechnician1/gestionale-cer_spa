import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatiEnergeticiService } from 'src/app/components/services/dati-energetici.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { DatiEnergeticiView } from 'src/app/core/interfaces/dati-energetici-view';
import { DatiEnergeticiModel } from 'src/app/core/interfaces/dati-energetici.model';

@Component({
  selector: 'app-dati-energetici-edit',
  templateUrl: './dati-energetici-edit.component.html',
})
export class DatiEnergeticiEditComponent implements OnInit {

  id? : number;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private service: DatiEnergeticiService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router
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
  attivo: [{value :'', disabled : true }],
  emailUtenteLoggato: ['']
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
      emailUtenteLoggato: res.emailUtenteLoggato
    });

  },
  error: (err) => {
    console.error('Errore caricamento edit', err);
  }
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

      }

    });
  }

  back(): void {
    this.router.navigate(['/dati-energetici']);
  }
}