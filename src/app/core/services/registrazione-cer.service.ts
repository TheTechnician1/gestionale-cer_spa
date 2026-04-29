import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiService } from './api.service';
import { AnagraficaCER } from '../interfaces/user.model';

export interface RegistrazioneCerPayload {
  ragioneSociale: string;
  codiceFiscale: string;
  partitaIVA: string;
  comuneSedeLegale: string;
  provinciaSedeLegale: string;
  regioneLegale: string;
  formaGiuridica: string;
  telefono: string;
  email: string;
  pec: string;
  sitoWeb: string;
  referente: string;
  flgCanc: string;
  specFormaGiuridica: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrazioneCerService {
  readonly formaGiuridicaAltro = 'Altro';
  private readonly codiceFiscalePattern =
    /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/;
  private readonly partitaIvaPattern = /^[0-9]{11}$/;
  private readonly telefonoPattern = /^(0|3)[0-9]{8,9}$/;
  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly sitoWebPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) { }

  creaFormRegistrazioneCer(): FormGroup {
    return this.formBuilder.group({
      ragioneSociale: ['', [Validators.required, Validators.minLength(2)]],
      codiceFiscale: [
        '',
        [Validators.required, Validators.pattern(this.codiceFiscalePattern)],
        [this.codiceFiscaleUnicoValidator()],
      ],
      partitaIVA: ['', [Validators.pattern(this.partitaIvaPattern)]],
      formaGiuridica: ['', [Validators.required]],
      specFormaGiuridica: [''],
      referente: ['', [Validators.required, Validators.minLength(2)]],
      comuneSedeLegale: ['', [Validators.required]],
      provinciaSedeLegale: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z]{2}$/)],
      ],
      regioneLegale: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(this.telefonoPattern)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailPattern),
        ],
      ],
      pec: ['', [Validators.email, Validators.pattern(this.emailPattern)]],
      sitoWeb: ['', [Validators.pattern(this.sitoWebPattern)]],
    });
  }

  registraCer(payload: RegistrazioneCerPayload): Observable<string> {
    return this.apiService.post<string>('/cer/inserisci', payload);
  }

  normalizzaPayload(form: FormGroup): RegistrazioneCerPayload {
    return {
      ragioneSociale: this.pulisci(form.get('ragioneSociale')?.value),
      codiceFiscale: this.pulisci(form.get('codiceFiscale')?.value).toUpperCase(),
      partitaIVA: this.pulisci(form.get('partitaIVA')?.value),
      comuneSedeLegale: this.pulisci(form.get('comuneSedeLegale')?.value),
      provinciaSedeLegale: this.pulisci(form.get('provinciaSedeLegale')?.value).toUpperCase(),
      regioneLegale: this.pulisci(form.get('regioneLegale')?.value),
      formaGiuridica: this.pulisci(form.get('formaGiuridica')?.value),
      telefono: this.pulisci(form.get('telefono')?.value).replace(/\s+/g, ''),
      email: this.pulisci(form.get('email')?.value).toLowerCase(),
      pec: this.pulisci(form.get('pec')?.value).toLowerCase(),
      sitoWeb: this.normalizzaSitoWeb(form.get('sitoWeb')?.value),
      referente: this.pulisci(form.get('referente')?.value),
      flgCanc: 'N',
      specFormaGiuridica:
        this.pulisci(form.get('formaGiuridica')?.value) === this.formaGiuridicaAltro
          ? this.pulisci(form.get('specFormaGiuridica')?.value)
          : '',
    };
  }

  codiceFiscaleUnicoValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const codiceFiscale = this.pulisci(control.value).toUpperCase();

      if (!codiceFiscale || !this.codiceFiscalePattern.test(codiceFiscale)) {
        return of(null);
      }

      return this.verificaCodiceFiscaleUnico(codiceFiscale).pipe(
        map((codiceUnico) => codiceUnico ? null : { codiceFiscaleDuplicato: true })
      );
    };
  }

  private verificaCodiceFiscaleUnico(codiceFiscale: string): Observable<boolean> {
    return this.apiService
      .post<AnagraficaCER[]>('/cer/ricerca', { codiceFiscale })
      .pipe(
        map((risultati) => risultati.length === 0),
        catchError(() => of(true))
      );
  }

  private normalizzaSitoWeb(value: unknown): string {
    const sitoWeb = this.pulisci(value);

    if (!sitoWeb) {
      return '';
    }

    return /^https?:\/\//i.test(sitoWeb) ? sitoWeb : `https://${sitoWeb}`;
  }

  private pulisci(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }
}
