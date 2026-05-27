import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImpiantoService } from '../../services/impianto.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { StatoImpianto } from "src/app/core/enum/stato-impianto.enum";
import { ToastService } from "src/app/core/services/toast.service";
import { Router, ActivatedRoute } from '@angular/router';
import { CerService } from '../../services/cer.service';
import { ConfigurazioneService } from '../../services/configurazione.service';
import { UtenteService } from "src/app/core/services/utente.service";
import { TerritorioService } from "../../services/territorio.service";
import { CodiceDescrizioneBase } from "src/app/core/interfaces/territorio.model";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-impianti-form',
  templateUrl: './impianti-form.component.html'
})
export class ImpiantiFormComponent implements OnInit {

  statiImpianto = Object.values(StatoImpianto);
  cerList: any[] = [];
  configurazioniList: any[] = [];
  regioni: CodiceDescrizioneBase[] = [];
  province: CodiceDescrizioneBase[] = [];
  comuni: CodiceDescrizioneBase[] = [];

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
    tipologiaProduttore: new FormControl(null, Validators.required),
    regione: new FormControl(null, Validators.required),
    provincia: new FormControl(null, Validators.required),
    comune: new FormControl(null, Validators.required),
    indirizzo: new FormControl(null, Validators.required),
    civico: new FormControl(null, Validators.required),
    cap: new FormControl(null, Validators.required),
    statoImpianto: new FormControl(StatoImpianto.ATTIVO, Validators.required),
    codiceInstallazione: new FormControl(null),
    specificaInstallazione: new FormControl(null),
    emailUtenteLoggato: new FormControl(null),
    dataUltimaModifica: new FormControl(null),
    utenteUltimaModifica: new FormControl(null)
  });

  

  constructor(
    private impiantoService: ImpiantoService,
    private toastService: ToastService,
    private cerService: CerService,
    private configurazioneService: ConfigurazioneService,
    private utenteService: UtenteService,
    private router: Router,
    private route: ActivatedRoute,
    private territorioService: TerritorioService,
    private translate: TranslateService
  ) {

     translate.use('it');

    this.form.get('flgAccumulo')?.valueChanges.subscribe(val => {
      const controlloAttivo = this.form.get('capAccumulo');
      if (val === 'S') {
        controlloAttivo?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        controlloAttivo?.clearValidators();
        controlloAttivo?.reset();
      }
      controlloAttivo?.updateValueAndValidity();
    });

    this.form.get('idCer')?.valueChanges.subscribe(idCer => {
      this.form.get('idConfigurazione')?.reset();
      this.form.get('idConfigurazione')?.disable();
      this.form.get('codiceCabina')?.reset();
      this.form.get('codiceCabina')?.disable();
      this.configurazioniList = [];
      if (idCer) {
        this.caricaConfigurazioni(idCer);
      }
    });

    this.form.get('idConfigurazione')?.valueChanges.subscribe(idConf => {
      console.log('idConf:', idConf);
      console.log('configurazioniList:', this.configurazioniList);
      console.log('find result:', this.configurazioniList.find(c => c.id === idConf));
      if (idConf && this.configurazioniList.length > 0) {
        const conf = this.configurazioniList.find(c => c.id === idConf);
        if (conf) {
          this.form.get('codiceCabina')?.setValue(conf.codiceCabina);
          this.form.get('codiceCabina')?.enable();
        }
      }
    });
  }

  ngOnInit(): void {
    this.cerService.ricercaCer({}).subscribe({
      next: (data) => this.cerList = data.map((c: any) => ({ id: c.idCer, descrizione: c.ragSociale })),
      error: (err) => console.error('Errore caricamento CER', err)
    });

    this.territorioService.getRegioni().subscribe({
  next: data => {
    console.log('regioni OK:', data);
    this.regioni = data;
  },
  error: err => console.error('Errore regioni:', err.status, err.message, err.error)
});

this.territorioService.getProvince().subscribe({
  next: data => {
    console.log('province OK:', data);
    this.province = data;
  },
  error: err => console.error('Errore province:', err.status, err.message, err.error)
});

this.territorioService.getComuni().subscribe({
  next: data => {
    console.log('comuni OK:', data);
    this.comuni = data;
  },
  error: err => console.error('Errore comuni:', err.status, err.message, err.error)
});
  }

  caricaConfigurazioni(idCer: number): void {
    this.configurazioneService.ricercaConfigurazione({ idCer }).subscribe({
      next: (data) => {
        console.log("configurazioniiii", data);
        this.configurazioniList = (data ?? []).map((c: any) => ({
          id: c.idConfig,
          descrizione: c.codiceCabina ?? c.ragioneSociale ?? c.idConfig,
          codiceCabina: c.codiceCabina
        }));

        if (this.configurazioniList.length > 0) {
          this.form.get('idConfigurazione')?.enable();
        }

        const idConf = this.form.get('idConfigurazione')?.value;
        if (idConf) {
          const conf = this.configurazioniList.find(c => c.id === idConf);
          if (conf) {
            this.form.get('codiceCabina')?.setValue(conf.codiceCabina);
            this.form.get('codiceCabina')?.enable();
          }
        }
      },
      error: (err) => console.error('Errore caricamento configurazioni', err)
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.toastService.error('Campi mancanti o errati');
      return;
    }

    const payload = this.form.getRawValue();
    payload.emailUtenteLoggato = (this.utenteService.currentUser as any)?.utente?.mail ?? this.utenteService.currentUser?.mail ?? '';

    this.impiantoService.createImpianto(payload)
      .pipe(
        tap(() => {
          this.toastService.success('Impianto creato con successo');
          this.router.navigate(['../'], { relativeTo: this.route });
        }),
        catchError(() => {
          this.toastService.error('Errore durante la creazione dell\'impianto');
          return of(null);
        })
      )
      .subscribe();
  }

  annulla(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onConfigurazioneChange(idConf: any): void {
    if (idConf && this.configurazioniList.length > 0) {
      const conf = this.configurazioniList.find(c => c.id === idConf);
      if (conf) {
        this.form.get('codiceCabina')?.setValue(conf.codiceCabina);
        this.form.get('codiceCabina')?.enable();
      }
    }
  }
}