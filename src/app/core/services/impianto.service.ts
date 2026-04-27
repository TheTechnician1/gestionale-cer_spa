import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  ImpiantoCER,
  ImpiantoPayload,
  ModificaImpiantoPayload,
  RicercaImpiantoRequest,
} from '../interfaces/user.model';
import { ApiService } from './api.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class ImpiantoService {
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {}

  creaFormImpianto(): FormGroup {
    return this.formBuilder.group({
      idImpianto: [null],
      idConfigurazione: [null, [Validators.required, Validators.min(1)]],
      codiceCabina: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{11}$/)]],
      partitaIva: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      dataEsercizio: ['', [Validators.required]],
      codTipologia: ['', [Validators.required]],
      tipologia: ['', [Validators.required]],
      preNom: [null, [Validators.required, Validators.min(0.01)]],
      flgAccumulo: [false],
      capAccumulo: [null],
      codCatProd: ['', [Validators.required]],
      categoriaProduttore: ['', [Validators.required]],
      regione: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      comune: ['', [Validators.required]],
      codTipoInst: ['', [Validators.required]],
      sitoInstallazione: ['', [Validators.required]],
    });
  }

  creaFormRicerca(): FormGroup {
    return this.formBuilder.group({
      annoAttivazioneDa: [0],
      annoAttivazioneA: [0],
      partitaIva: [''],
      regione: [''],
      provincia: [''],
      comune: [''],
      codiceCabina: [''],
      codTipologia: [''],
      categoriaProduttore: [''],
      codTipoInst: [''],
    });
  }

  ricerca(payload: RicercaImpiantoRequest): Observable<ImpiantoCER[]> {
    return this.apiService.post<ImpiantoCER[]>(
      '/impianti/ricerca-avanzata',
      this.creaPayloadRicerca(payload)
    );
  }

  visualizza(idImpianto: number): Observable<ImpiantoCER> {
    return this.apiService.get<ImpiantoCER>(`/impianti/visualizza/${idImpianto}`);
  }

  inserisci(payload: ImpiantoPayload): Observable<string> {
    return this.apiService.post<string>('/impianti/inserisci', payload);
  }

  modifica(payload: ModificaImpiantoPayload): Observable<string> {
    return this.apiService.put<string>('/impianti/modifica', payload);
  }

  cancella(idImpianto: number): Observable<string> {
    return this.apiService.delete<string>(`/impianti/cancella/${idImpianto}`);
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

  normalizzaRicerca(form: FormGroup): RicercaImpiantoRequest {
    return {
      annoAttivazioneDa: this.numero(form.get('annoAttivazioneDa')?.value),
      annoAttivazioneA: this.numero(form.get('annoAttivazioneA')?.value),
      partitaIva: this.pulisci(form.get('partitaIva')?.value),
      regione: this.pulisci(form.get('regione')?.value),
      provincia: this.pulisci(form.get('provincia')?.value),
      comune: this.pulisci(form.get('comune')?.value),
      codiceCabina: this.pulisci(form.get('codiceCabina')?.value).toUpperCase(),
      codTipologia: this.pulisci(form.get('codTipologia')?.value),
      categoriaProduttore: this.pulisci(form.get('categoriaProduttore')?.value),
      codTipoInst: this.pulisci(form.get('codTipoInst')?.value),
    };
  }

  normalizzaInserimento(form: FormGroup): ImpiantoPayload {
    const idConfigurazione = this.numero(form.get('idConfigurazione')?.value);
    const codTipologia = this.pulisci(form.get('codTipologia')?.value);

    return {
      idConfigurazione,
      codiceCabina: this.pulisci(form.get('codiceCabina')?.value).toUpperCase(),
      dataEsercizio: this.pulisci(form.get('dataEsercizio')?.value),
      codTipologia,
      tipologia: this.pulisci(form.get('tipologia')?.value),
      partitaIva: this.pulisci(form.get('partitaIva')?.value),
      codCatProd: this.pulisci(form.get('codCatProd')?.value),
      categoriaProduttore: this.pulisci(form.get('categoriaProduttore')?.value),
      ubicazioni: [
        {
          regione: this.pulisci(form.get('regione')?.value),
          provincia: this.pulisci(form.get('provincia')?.value),
          comune: this.pulisci(form.get('comune')?.value),
          codTipoInst: this.pulisci(form.get('codTipoInst')?.value),
          sitoInstallazione: this.pulisci(form.get('sitoInstallazione')?.value),
          idConfigurazione,
          codTipologia,
        },
      ],
    };
  }

  normalizzaModifica(form: FormGroup): ModificaImpiantoPayload {
    return {
      idImpianto: this.numero(form.get('idImpianto')?.value),
      configurazione: {
        idConfig: this.numero(form.get('idConfigurazione')?.value),
        codiceCabina: this.pulisci(form.get('codiceCabina')?.value).toUpperCase(),
      },
      flgEsercizio: 'S',
      dataEserc: this.pulisci(form.get('dataEsercizio')?.value),
      codTipologia: this.pulisci(form.get('codTipologia')?.value),
      preNom: this.numero(form.get('preNom')?.value),
      flgAccumulo: !!form.get('flgAccumulo')?.value,
      capAccumulo: this.numero(form.get('capAccumulo')?.value),
      codCatProduttore: this.pulisci(form.get('codCatProd')?.value),
      flgCanc: 'N',
      specTipologia: this.pulisci(form.get('tipologia')?.value),
      specCatProduttore: this.pulisci(form.get('categoriaProduttore')?.value),
      codSitoInst: this.pulisci(form.get('codTipoInst')?.value),
    };
  }

  popolaForm(form: FormGroup, impianto: ImpiantoCER): void {
    const ubicazione = impianto.ubicazioni?.[0];

    form.patchValue({
      idImpianto: impianto.idImpianto ?? null,
      idConfigurazione: impianto.idConfigurazione ?? ubicazione?.idConfigurazione ?? null,
      codiceCabina: impianto.codiceCabina ?? '',
      partitaIva: impianto.partitaIva ?? '',
      dataEsercizio: impianto.dataEsercizio ?? '',
      codTipologia: impianto.codTipologia ?? ubicazione?.codTipologia ?? '',
      tipologia: impianto.tipologia ?? '',
      codCatProd: impianto.codCatProd ?? '',
      categoriaProduttore: impianto.categoriaProduttore ?? '',
      regione: ubicazione?.regioneNome || ubicazione?.regione || '',
      provincia: ubicazione?.provincia ?? '',
      comune: ubicazione?.comuneNome || ubicazione?.comune || '',
      codTipoInst: ubicazione?.codTipoInst ?? '',
      sitoInstallazione: ubicazione?.sitoInstallazione ?? '',
    });
  }

  comuneImpianto(impianto: ImpiantoCER): string {
    const ubicazione = impianto.ubicazioni?.[0];
    return ubicazione?.comuneNome || ubicazione?.comune || '';
  }

  provinciaImpianto(impianto: ImpiantoCER): string {
    return impianto.ubicazioni?.[0]?.provincia || '';
  }

  sitoInstallazione(impianto: ImpiantoCER): string {
    return impianto.ubicazioni?.[0]?.sitoInstallazione || '';
  }

  impiantiConfigurazione(
    configurazioneId: number | null,
    impianti: ImpiantoCER[],
    impiantiConfigurazione: ImpiantoCER[] = []
  ): ImpiantoCER[] {
    if (impiantiConfigurazione.length > 0) {
      return impiantiConfigurazione;
    }

    if (!configurazioneId) {
      return [];
    }

    return impianti.filter(
      (impianto) =>
        impianto.idConfigurazione === configurazioneId ||
        impianto.ubicazioni?.some((ubicazione) => ubicazione.idConfigurazione === configurazioneId)
    );
  }

  private creaPayloadRicerca(
    payload: RicercaImpiantoRequest
  ): RicercaImpiantoRequest {
    return Object.entries(payload).reduce<RicercaImpiantoRequest>(
      (acc, [key, value]) => {
        if (typeof value === 'string' && value.trim().length > 0) {
          return {
            ...acc,
            [key]: value.trim(),
          };
        }

        if (typeof value === 'number' && value > 0) {
          return {
            ...acc,
            [key]: value,
          };
        }

        return acc;
      },
      {}
    );
  }

  private pulisci(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private numero(value: unknown): number {
    const numero = Number(value);
    return Number.isFinite(numero) ? numero : 0;
  }
}
