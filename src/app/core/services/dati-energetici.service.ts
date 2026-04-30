import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import {
  DatiEnergetici,
  RicercaDatiEnergeticiRequest,
} from '../interfaces/user.model';
import { ApiService } from './api.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class DatiEnergeticiService {
  private readonly fattoreEmissioneKey = 'fattoreEmissioneCo2';

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {}

  creaFormRicerca(): FormGroup {
    return this.formBuilder.group({
      daAnno: [''],
      getaAnno: [''],
      partitaIva: [''],
      codiceCabina: [''],
      stato: [''],
    });
  }

  creaFormDatiEnergetici(): FormGroup {
    return this.formBuilder.group({
      idDati: [null],
      idCer: [null, [Validators.required, Validators.min(1)]],
      idConfigurazione: [null, [Validators.required, Validators.min(1)]],
      codiceCabina: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{11}$/)]],
      anno: [this.annoRiferimento(), [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      geteProdotta: [null, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
      getePrelevata: [null, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
      geteImmessa: [null, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
      geteCondivisa: [null, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
      geteAutoCons: [null, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
      tariffaPremium: [null, [Validators.required, Validators.min(0)]],
      corrPremioOtt: [null, [Validators.required, Validators.min(0)]],
      ridEmCo2: ['', [Validators.required]],
      statoScheda: ['Active', [Validators.required]],
      calcoloCo2Automatico: [false],
      fattoreEmissioneCo2: [this.fattoreEmissioneCo2(), [Validators.required, Validators.min(0)]],
    });
  }

  ricerca(payload: RicercaDatiEnergeticiRequest): Observable<DatiEnergetici[]> {
    return this.apiService.post<DatiEnergetici[]>(
      '/dati-energetici/ricerca',
      this.creaPayloadRicerca(payload)
    ).pipe(map((risultati) => risultati.map((dati) => this.normalizzaDati(dati))));
  }

  visualizza(idDati: number): Observable<DatiEnergetici> {
    return this.apiService
      .get<DatiEnergetici>(`/dati-energetici/visualizza/${idDati}`)
      .pipe(map((dati) => this.normalizzaDati(dati)));
  }

  inserisci(payload: DatiEnergetici): Observable<string> {
    return this.apiService.post<string>('/dati-energetici/inserisci', payload);
  }

  modifica(payload: DatiEnergetici): Observable<string> {
    return this.apiService.put<string>('/dati-energetici/modifica', payload);
  }

  cancella(idDati: number): Observable<string> {
    return this.apiService.delete<string>(`/dati-energetici/cancella/${idDati}`);
  }

  puoInserire(): boolean {
    return this.loginService.currentUser?.ruolo === 'ADMIN';
  }

  puoModificare(): boolean {
    const ruolo = this.loginService.currentUser?.ruolo;
    return ruolo === 'ADMIN' || ruolo === 'GEST';
  }

  puoCancellare(): boolean {
    const ruolo = this.loginService.currentUser?.ruolo;
    return ruolo === 'ADMIN' || ruolo === 'GEST';
  }

  passwordSessioneValida(password: string): boolean {
    return this.loginService.getAccessoRequest()?.password === password;
  }

  normalizzaRicerca(form: FormGroup): RicercaDatiEnergeticiRequest {
    return {
      daAnno: this.annoNonNegativo(form.get('daAnno')?.value),
      getaAnno: this.annoNonNegativo(form.get('getaAnno')?.value),
      partitaIva: this.pulisci(form.get('partitaIva')?.value),
      codiceCabina: this.pulisci(form.get('codiceCabina')?.value).toUpperCase(),
      stato: this.normalizzaStatoScheda(form.get('stato')?.value),
    };
  }

  normalizzaSalvataggio(form: FormGroup): DatiEnergetici {
    this.aggiornaFattoreEmissione(form);

    return {
      idDati: this.numeroONull(form.get('idDati')?.value) ?? undefined,
      idCer: this.numero(form.get('idCer')?.value),
      idConfigurazione: this.numero(form.get('idConfigurazione')?.value),
      anno: this.pulisci(form.get('anno')?.value),
      geteProdotta: this.numeroNonNegativo(form.get('geteProdotta')?.value),
      getePrelevata: this.numeroNonNegativo(form.get('getePrelevata')?.value),
      geteImmessa: this.numeroNonNegativo(form.get('geteImmessa')?.value),
      geteCondivisa: this.numeroNonNegativo(form.get('geteCondivisa')?.value),
      geteAutoCons: this.numeroNonNegativo(form.get('geteAutoCons')?.value),
      tariffaPremium: this.numeroNonNegativo(form.get('tariffaPremium')?.value),
      corrPremioOtt: this.numeroNonNegativo(form.get('corrPremioOtt')?.value),
      ridEmCo2: this.pulisci(form.get('ridEmCo2')?.value),
      statoScheda: this.normalizzaStatoScheda(form.get('statoScheda')?.value) || 'N',
    };
  }

  popolaForm(form: FormGroup, dati: DatiEnergetici): void {
    form.patchValue({
      idDati: dati.idDati ?? null,
      idCer: dati.idCer ?? null,
      idConfigurazione: dati.idConfigurazione ?? null,
      codiceCabina: dati.codiceCabina ?? '',
      anno: dati.anno ?? this.annoRiferimento(),
      geteProdotta: dati.geteProdotta ?? null,
      getePrelevata: dati.getePrelevata ?? null,
      geteImmessa: dati.geteImmessa ?? null,
      geteCondivisa: dati.geteCondivisa ?? null,
      geteAutoCons: dati.geteAutoCons ?? null,
      tariffaPremium: dati.tariffaPremium ?? null,
      corrPremioOtt: dati.corrPremioOtt ?? null,
      ridEmCo2: dati.ridEmCo2 ?? '',
      statoScheda: this.statoSchedaPerForm(dati.statoScheda),
      calcoloCo2Automatico: false,
      fattoreEmissioneCo2: this.fattoreEmissioneCo2(),
    });
  }

  calcolaRiduzioneCo2(form: FormGroup): string {
    const energiaProdotta = this.numeroNonNegativo(form.get('geteProdotta')?.value);
    const fattoreEmissione = this.numeroNonNegativo(form.get('fattoreEmissioneCo2')?.value);
    return String(Math.round(energiaProdotta * fattoreEmissione));
  }

  idDati(dati: DatiEnergetici): number | null {
    return dati.idDati ?? null;
  }

  statoDati(dati: DatiEnergetici): string {
    const flag = this.flagCancellazione(dati);

    if (flag === 'S') {
      return 'Disabled';
    }

    if (flag === 'N') {
      return 'Active';
    }

    return dati.statoScheda || '';
  }

  datoCancellato(dati: DatiEnergetici): boolean {
    return this.flagCancellazione(dati) === 'S';
  }

  filtraAttivi(datiEnergetici: DatiEnergetici[]): DatiEnergetici[] {
    return datiEnergetici.filter((dati) => !this.datoCancellato(dati));
  }

  datiConfigurazione(
    idConfigurazione: number | null,
    datiEnergetici: DatiEnergetici[],
    idCer?: number | null
  ): DatiEnergetici[] {
    if (!idConfigurazione) {
      return [];
    }

    return datiEnergetici.filter(
      (dati) =>
        dati.idConfigurazione === idConfigurazione &&
        (!idCer || dati.idCer === idCer) &&
        !this.datoCancellato(dati)
    );
  }

  private creaPayloadRicerca(
    payload: RicercaDatiEnergeticiRequest
  ): RicercaDatiEnergeticiRequest {
    return Object.entries(payload).reduce<RicercaDatiEnergeticiRequest>(
      (acc, [key, value]) => {
        if (typeof value === 'string' && value.trim().length > 0) {
          return {
            ...acc,
            [key]: value.trim(),
          };
        }

        return acc;
      },
      {}
    );
  }

  private annoRiferimento(): string {
    return String(new Date().getFullYear() - 1);
  }

  private fattoreEmissioneCo2(): number {
    const valore = Number(localStorage.getItem(this.fattoreEmissioneKey));
    return Number.isFinite(valore) && valore >= 0 ? valore : 0.35;
  }

  private aggiornaFattoreEmissione(form: FormGroup): void {
    const valore = this.numeroNonNegativo(form.get('fattoreEmissioneCo2')?.value);
    localStorage.setItem(this.fattoreEmissioneKey, String(valore));
  }

  private pulisci(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private annoNonNegativo(value: unknown): string {
    const pulito = typeof value === 'number' ? String(value) : this.pulisci(value);
    const numero = Number(pulito);
    return !pulito || !Number.isFinite(numero) || numero < 0 ? '' : pulito;
  }

  private numero(value: unknown): number {
    const numero = Number(value);
    return Number.isFinite(numero) ? numero : 0;
  }

  private numeroNonNegativo(value: unknown): number {
    return Math.max(0, this.numero(value));
  }

  private numeroONull(value: unknown): number | null {
    const numero = this.numero(value);
    return numero > 0 ? numero : null;
  }

  private normalizzaStatoScheda(value: unknown): string {
    const stato = this.pulisci(value).toUpperCase();

    if (!stato) {
      return '';
    }

    if (
      stato === 'S' ||
      stato === 'DISABLED' ||
      stato === 'DEACTIVATED' ||
      stato === 'DISATTIVA' ||
      stato === 'NON ATTIVA'
    ) {
      return 'S';
    }

    if (stato === 'N' || stato === 'ACTIVE' || stato === 'ATTIVA') {
      return 'N';
    }

    return stato;
  }

  private statoSchedaPerForm(value: unknown): string {
    const stato = this.normalizzaStatoScheda(value);

    if (stato === 'S') {
      return 'Disabled';
    }

    return 'Active';
  }

  private flagCancellazione(dati: DatiEnergetici): string {
    const raw = dati as unknown as Record<string, unknown>;
    const flag =
      dati.flgCanc ??
      dati.statoScheda ??
      raw['flgcancellazione'] ??
      raw['flgCancellazione'] ??
      raw['flg_cancellazione'] ??
      '';

    return String(flag).trim().toUpperCase();
  }

  private normalizzaDati(dati: DatiEnergetici): DatiEnergetici {
    const raw = dati as Record<string, any>;

    return {
      ...dati,
      idDati: dati.idDati ?? raw['id'] ?? raw['idDato'] ?? undefined,
      idCer: dati.idCer ?? raw['cerId'] ?? raw['idCER'] ?? 0,
      idConfigurazione:
        dati.idConfigurazione ?? raw['idConfig'] ?? raw['idConfigurazione'] ?? 0,
      statoScheda:
        dati.statoScheda ??
        raw['flgCanc'] ??
        raw['flgcancellazione'] ??
        raw['flgCancellazione'] ??
        '',
    };
  }
}
