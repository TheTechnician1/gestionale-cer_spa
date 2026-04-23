import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroupDirective,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-registrazione-utente',
  templateUrl: './registrazione-utente.component.html',
  styleUrls: ['./registrazione-utente.component.scss'],
})
export class RegistrazioneUtenteComponent implements OnInit {
  nascondiPassword: boolean = true;
  nascondiConfermaPassword: boolean = true;
  formRegistrazione: FormGroup;

  private snackBar = inject(MatSnackBar);

  constructor(
    private costruttoreForm: FormBuilder,
    private loginService: LoginService
  ) {
    this.formRegistrazione = this.costruttoreForm.group(
      {
        nomeUtente: ['', [Validators.required, Validators.minLength(2)]],
        cognomeUtente: ['', [Validators.required, Validators.minLength(2)]],
        codiceFiscale: [
          '',
          [Validators.required, Validators.pattern(/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1}$/)],  //implementare il pattern del codice fiscale italiano
        ],
        mail: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
        telefono: [
          '',
          [Validators.required, Validators.pattern(/^(0|3)[0-9]{8,9}$/)],  //implementare riconoscimento numeri italiani? \+?[0-9\s]{8,15} 
        ],
        ruolo: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[*!$?^°#@%&£§]).+$/), //implementare i caratteri speciali?
          ],
        ],
        confermaPassword: ['', [Validators.required]],
      },
      {
        validators: this.validatorePasswordCoincidenti(),
      }
    );
  }

  ngOnInit(): void {
    this.formRegistrazione.get('codiceFiscale')?.valueChanges.subscribe(val => {
      if (val) {
        this.formRegistrazione.get('codiceFiscale')?.setValue(
          val.toUpperCase(),
          { emitEvent: false } // evita loop infinito
        );
      }
    });
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

  // reset(){
  //   this.formRegistrazione.reset()
  //   console.log(this.formRegistrazione.getRawValue())
  // }
  

  inviaModulo(): void {
    if (this.formRegistrazione.invalid) {
      this.formRegistrazione.markAllAsTouched();
      return;
    }

    const { confermaPassword, ...payload } = this.formRegistrazione.getRawValue();

    console.log('Utente registrato:', payload);

    this.loginService.registraUtente(payload).subscribe({
      next: (risposta) => {
        console.log(risposta);

        this.snackBar.open(
          'User registered successfully',
          'Close',
          {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          }
        );

        
        this.formRegistrazione.reset();

        this.nascondiPassword = true;
        this.nascondiConfermaPassword = true;
      },
      error: (errore) => {

        console.error('Errore registrazione utente: ', errore);
        

      },
    });
  }



}
