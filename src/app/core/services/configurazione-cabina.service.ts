import { Injectable } from '@angular/core';
import { HttpContext } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import {
  ConfigurazioneCabina,
  ConfigurazionePayload,
  RicercaConfigurazioneRequest,
} from '../interfaces/user.model';
import { ApiService } from './api.service';
import { LoginService } from './login.service';
import { SILENT_HTTP_ERROR } from '../interceptor/http-status/http-status.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ConfigurazioneCabinaService {
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {}

  creaFormConfigurazione(): FormGroup {
    return this.formBuilder.group({
      idConfig: [0, [Validators.required, Validators.min(0)]],
      idCer: [null, [Validators.required, Validators.min(1)]],
      codiceCabina: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{11}$/)]],
      annoAttivazione: [null, [Validators.required, Validators.min(1900)]],
    });
  }

  creaFormRicerca(): FormGroup {
    return this.formBuilder.group({
      idConfig: [null],
      idCer: [null],
      codiceCabina: [''],
      annoAttivazione: [null],
    });
  }

  ricerca(payload: RicercaConfigurazioneRequest = {}): Observable<ConfigurazioneCabina[]> {
    return this.apiService.post<unknown[]>(
      '/configurazioni/ricerca',
      this.creaPayloadRicerca(payload)
    ).pipe(
      map((risultati) => this.normalizzaRisultatiRicerca(risultati))
    );
  }

  visualizza(idConfig: number, mostraErrore = true): Observable<ConfigurazioneCabina> {
    return this.apiService
      .get<ConfigurazioneCabina>(
        `/configurazioni/visualizza/${idConfig}`,
        undefined,
        this.creaContestoErrore(mostraErrore)
      )
      .pipe(map((configurazione) => this.normalizzaConfigurazione(configurazione)));
  }

  arricchisciConDettaglio(
    configurazioni: ConfigurazioneCabina[]
  ): Observable<ConfigurazioneCabina[]> {
    if (configurazioni.length === 0) {
      return of([]);
    }

    return forkJoin(
      configurazioni.map((configurazione) => {
        const idConfig = this.idConfigurazione(configurazione);

        if (!idConfig) {
          return of(this.normalizzaConfigurazione(configurazione));
        }

        return this.visualizza(idConfig, false).pipe(
          map((dettaglio) => this.unisciConfigurazioni(configurazione, dettaglio)),
          catchError(() => of(this.normalizzaConfigurazione(configurazione)))
        );
      })
    );
  }

  ricercaDisattivate(
    payload: RicercaConfigurazioneRequest = {}
  ): Observable<ConfigurazioneCabina[]> {
    return this.ricerca(payload).pipe(
      map((configurazioni) => this.filtraConfigurazioniDisattive(configurazioni, payload)),
      catchError(() => of([]))
    );
  }

  inserisci(payload: ConfigurazionePayload): Observable<string> {
    return this.apiService.post<string>('/configurazioni/inserisci', payload);
  }

  modifica(payload: ConfigurazionePayload): Observable<string> {
    return this.apiService.put<string>('/configurazioni/modifica', payload);
  }

  cancella(idConfig: number): Observable<string> {
    return this.apiService.delete<string>(`/configurazioni/cancella/${idConfig}`);
  }

  puoInserire(): boolean {
    return this.loginService.currentUser?.ruolo === 'ADMIN';
  }

  puoModificare(): boolean {
    const ruolo = this.loginService.currentUser?.ruolo;
    return ruolo === 'ADMIN' || ruolo === 'GEST';
  }

  puoCancellare(): boolean {
    return this.loginService.currentUser?.ruolo === 'ADMIN';
  }

  passwordSessioneValida(password: string): boolean {
    return this.loginService.getAccessoRequest()?.password === password;
  }

  normalizzaRicerca(form: FormGroup): RicercaConfigurazioneRequest {
    return {
      idConfig: this.numeroONull(form.get('idConfig')?.value),
      idCer: this.numeroONull(form.get('idCer')?.value),
      codiceCabina: this.pulisci(form.get('codiceCabina')?.value).toUpperCase(),
      annoAttivazione: this.numeroONull(form.get('annoAttivazione')?.value),
    };
  }

  normalizzaSalvataggio(form: FormGroup): ConfigurazionePayload {
    return {
      idConfig: this.numero(form.get('idConfig')?.value),
      idCer: this.numero(form.get('idCer')?.value),
      codiceCabina: this.pulisci(form.get('codiceCabina')?.value).toUpperCase(),
      annoAttivazione: this.numero(form.get('annoAttivazione')?.value),
      flgcancellazione: 'N',
    };
  }

  popolaForm(form: FormGroup, configurazione: ConfigurazioneCabina): void {
    form.patchValue({
      idConfig: this.idConfigurazione(configurazione),
      idCer: configurazione.idCer ?? configurazione.cer?.idCer ?? null,
      codiceCabina: this.codiceCabina(configurazione),
      annoAttivazione: configurazione.annoAttivazione ?? null,
    });
  }

  idConfigurazione(configurazione: ConfigurazioneCabina): number | null {
    return configurazione.idConfig ?? configurazione.idConfigurazione ?? null;
  }

  stato(configurazione: ConfigurazioneCabina): string {
    if (this.flagCancellazioneDisattiva(configurazione)) {
      return 'Disabled';
    }

    return configurazione.stato || 'Active';
  }

  configurazioneDisattiva(configurazione: ConfigurazioneCabina): boolean {
    const stato = configurazione.stato?.toUpperCase();

    return (
      this.flagCancellazioneDisattiva(configurazione) ||
      stato === 'DISABLED' ||
      stato === 'DEACTIVATED' ||
      stato === 'DISATTIVA' ||
      stato === 'DISATTIVATA' ||
      stato === 'CANCELLATA'
    );
  }

  codiceCabina(configurazione: ConfigurazioneCabina): string {
    const raw = configurazione as Record<string, any>;

    return this.primaStringa([
      configurazione.codiceCabina,
      configurazione.codCabina,
      raw['codice'],
      raw['codCab'],
      raw['cabina']?.codiceCabina,
      raw['cabina']?.codCabina,
      raw['cabinaEnergetica']?.codiceCabina,
      raw['cabinaEnergetica']?.codCabina,
      raw['impianti']?.[0]?.codiceCabina,
      raw['impianti']?.[0]?.codCabina,
    ]);
  }

  private creaPayloadRicerca(
    payload: RicercaConfigurazioneRequest
  ): RicercaConfigurazioneRequest {
    return {
      idConfig: payload.idConfig ?? null,
      idCer: payload.idCer ?? null,
      codiceCabina: payload.codiceCabina ?? '',
      annoAttivazione: payload.annoAttivazione ?? null,
    };
  }

  private creaContestoErrore(mostraErrore: boolean): HttpContext | undefined {
    return mostraErrore
      ? undefined
      : new HttpContext().set(SILENT_HTTP_ERROR, true);
  }

  private pulisci(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private numero(value: unknown): number {
    const numero = Number(value);
    return Number.isFinite(numero) ? numero : 0;
  }

  private numeroONull(value: unknown): number | null {
    const numero = this.numero(value);
    return numero > 0 ? numero : null;
  }

  private normalizzaRisultatiRicerca(risultati: unknown[]): ConfigurazioneCabina[] {
    return risultati.flatMap((item) => {
      const raw = item as Record<string, any>;
      const configurazioni = raw['configurazioni'];

      if (!Array.isArray(configurazioni)) {
        return [this.normalizzaConfigurazione(item as ConfigurazioneCabina)];
      }

      return configurazioni.map((configurazioneRaw) => {
        const configurazione = configurazioneRaw as ConfigurazioneCabina;

        return this.normalizzaConfigurazione({
          ...configurazione,
          idCer: configurazione.idCer ?? raw['idCer'],
          cer: {
            idCer: raw['idCer'],
            ragioneSociale: raw['ragioneSociale'] ?? '',
            codiceFiscale: '',
            comuneSedeLegale: '',
            provinciaSedeLegale: '',
            regioneLegale: '',
            formaGiuridica: '',
            telefono: 0,
            email: '',
            pec: '',
            sitoWeb: '',
            referente: '',
            partitaIVA: '',
          },
        });
      });
    });
  }

  private normalizzaConfigurazione(
    configurazione: ConfigurazioneCabina
  ): ConfigurazioneCabina {
    const raw = configurazione as Record<string, any>;

    return {
      ...configurazione,
      idConfig:
        configurazione.idConfig ??
        configurazione.idConfigurazione ??
        raw['id'] ??
        raw['idConfig'] ??
        raw['idconfig'] ??
        undefined,
      idCer:
        configurazione.idCer ??
        configurazione.cer?.idCer ??
        raw['cerId'] ??
        raw['idCER'] ??
        undefined,
      codiceCabina: this.codiceCabina(configurazione),
      flgCanc: configurazione.flgCanc ?? configurazione.flgcancellazione ?? raw['flgCancellazione'] ?? raw['flgcancellazione'],
      annoAttivazione:
        configurazione.annoAttivazione ??
        raw['anno'] ??
        raw['annoAttivazione'] ??
        undefined,
    };
  }

  private unisciConfigurazioni(
    configurazione: ConfigurazioneCabina,
    dettaglio: ConfigurazioneCabina
  ): ConfigurazioneCabina {
    const base = this.normalizzaConfigurazione(configurazione);
    const dettaglioNormalizzato = this.normalizzaConfigurazione(dettaglio);

    return {
      ...base,
      ...dettaglioNormalizzato,
      codiceCabina:
        dettaglioNormalizzato.codiceCabina ||
        base.codiceCabina ||
        this.codiceCabina(dettaglioNormalizzato),
      impianti: dettaglioNormalizzato.impianti ?? base.impianti,
      cer: dettaglioNormalizzato.cer ?? base.cer,
    };
  }

  private primaStringa(values: unknown[]): string {
    const valore = values.find(
      (item) => typeof item === 'string' && item.trim().length > 0
    );

    return typeof valore === 'string' ? valore.trim() : '';
  }

  private flagCancellazione(configurazione: ConfigurazioneCabina): string {
    const raw = configurazione as Record<string, any>;

    return this.primaStringa([
      configurazione.flgCanc,
      configurazione.flgcancellazione,
      raw['flgCancellazione'],
      raw['flgcancellazione'],
      raw['flg_cancellazione'],
    ]).toUpperCase();
  }

  private flagCancellazioneDisattiva(configurazione: ConfigurazioneCabina): boolean {
    return this.flagCancellazione(configurazione) === 'S';
  }

  private filtraConfigurazioniDisattive(
    configurazioni: ConfigurazioneCabina[],
    payload: RicercaConfigurazioneRequest
  ): ConfigurazioneCabina[] {
    return configurazioni
      .filter(
        (configurazione) =>
          this.configurazioneDisattiva(configurazione) &&
          this.configurazioneRispettaFiltri(configurazione, payload)
      )
      .sort(
        (a, b) =>
          (this.idConfigurazione(a) ?? 0) - (this.idConfigurazione(b) ?? 0)
      );
  }

  private configurazioneRispettaFiltri(
    configurazione: ConfigurazioneCabina,
    payload: RicercaConfigurazioneRequest
  ): boolean {
    const idConfig = this.idConfigurazione(configurazione);
    const idCer = configurazione.idCer ?? configurazione.cer?.idCer ?? null;
    const codiceCabina = this.codiceCabina(configurazione).toLowerCase();

    return (
      (!payload.idConfig || idConfig === payload.idConfig) &&
      (!payload.idCer || idCer === payload.idCer) &&
      (!payload.codiceCabina ||
        codiceCabina.includes(payload.codiceCabina.toLowerCase())) &&
      (!payload.annoAttivazione ||
        configurazione.annoAttivazione === payload.annoAttivazione)
    );
  }
}
