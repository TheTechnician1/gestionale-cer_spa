import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface RegistrazioneUtentePayload {
  nome: string;
  cognome: string;
  codiceFiscale: string;
  email: string;
  numeroTelefono: string;
  ruolo: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrazioneUtenteService {
  readonly elencoRuoli: string[] = ['ADMIN', 'GEST'];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) { }

  creaFormRegistrazioneUtente(): FormGroup {
    return this.formBuilder.group(
      {
        nome: ['', [Validators.required, Validators.minLength(2)]],
        cognome: ['', [Validators.required, Validators.minLength(2)]],
        codiceFiscale: [
          '',
          [Validators.required, Validators.pattern(/^[A-Z,a-z,0-9]{16}$/)],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
          ],
        ],
        numeroTelefono: [
          '',
          [Validators.required, Validators.pattern(/^\+?[0-9\s]{8,15}$/)],
        ],
        ruolo: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/),
          ],
        ],
        confermaPassword: ['', [Validators.required]],
      },
      {
        validators: this.validatorePasswordCoincidenti(),
      }
    );
  }

  validatorePasswordCoincidenti(): ValidatorFn {
    return (controllo: AbstractControl): ValidationErrors | null => {
      const password = controllo.get('password')?.value;
      const confermaPassword = controllo.get('confermaPassword')?.value;

      if (!password || !confermaPassword) {
        return null;
      }

      if (password !== confermaPassword) {
        return { passwordNonCoincidenti: true };
      }

      return null;
    };
  }

  normalizzaPayload(form: FormGroup): RegistrazioneUtentePayload {
    return {
      nome: this.pulisci(form.get('nome')?.value),
      cognome: this.pulisci(form.get('cognome')?.value),
      codiceFiscale: this.pulisci(form.get('codiceFiscale')?.value).toUpperCase(),
      email: this.pulisci(form.get('email')?.value),
      numeroTelefono: this.pulisci(form.get('numeroTelefono')?.value),
      ruolo: this.pulisci(form.get('ruolo')?.value),
      password: this.pulisci(form.get('password')?.value),
    };
  }

  registraUtente(payload: RegistrazioneUtentePayload): Observable<string> {
    return this.apiService.post<string>('Utente/crea-utente', payload);
  }

  private pulisci(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }
}
