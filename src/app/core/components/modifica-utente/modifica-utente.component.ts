import { Component, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { UtenteService } from '../../services/utente.service';
import { Utente, UtenteModel } from '../../interfaces/utente.model';

@Component({
  selector: 'app-modifica-utente',
  templateUrl: './modifica-utente.component.html',
  styleUrls: ['./modifica-utente.component.scss']
})
export class ModificaUtenteComponent {
  constructor(private fb: FormBuilder, private userService: UtenteService, private snackBar: MatSnackBar) {}
  utente: Utente | null = new UtenteModel();
  profileForm!: FormGroup;
  saving = false;
  originalBalance = this.utente?.balance;
  userId = this.userService.currentUser?.id;


  ngOnInit() {
    this.initForm();
    this.loadUtenteFromService();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['utente'] && this.utente) {
      this.originalBalance = Number(this.utente.balance ?? 0);
      this.patchFormWithUser();
      this.updateBalanceValidators();
    }
  }

  initForm() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,}$")]],
      lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,}$")]],
      email: ['', [Validators.required, Validators.email]],
      balance: [0, [Validators.required, Validators.min(0)]],
      newPassword: ['', [Validators.minLength(6), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,64}$")]],
      confirmPassword: ['']
    },
    { validators: this.passwordsMatch });
  }

  patchFormWithUser() {
    if (!this.profileForm) this.initForm();
    this.profileForm.patchValue({
      firstName: this.utente?.name ?? '',
      lastName: this.utente?.surname ?? '',
      email: this.utente?.email ?? '',
      balance: this.utente?.balance ?? 0
    });
  }

  updateBalanceValidators() {
    const control = this.profileForm.get('balance');
    if (!control) return;

    const minValidator = Validators.min(this.originalBalance!);
    const customValidator: ValidatorFn = (c: AbstractControl) => {
      const val = c.value;
      if (val == null || val === '') return null;
      return Number(val) < this.originalBalance! ? { lessThanOriginal: true } : null;
    };

    control.setValidators([Validators.required, minValidator, customValidator]);
    control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  passwordsMatch(group: AbstractControl) {
    const pw = group.get('newPassword')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
  }

  loadUtenteFromService() {
    const current = this.userService.currentUser;
    if (current) {
      this.utente = current;
      this.originalBalance = Number(this.utente.balance ?? 0);
      this.patchFormWithUser();
      this.updateBalanceValidators();
    }
  }

  save() {
    if (!this.profileForm) return;
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = { ...this.profileForm.value };

    if (!payload.newPassword) delete payload.newPassword;
    if (!payload.confirmPassword) delete payload.confirmPassword;

    const userId = this.utente?.id;
    if (!userId) {
      this.saving = false;
      this.snackBar.open('Impossibile aggiornare: utente non definito', 'OK', { duration: 3000 });
      return;
    }

    this.userService.updateUser(userId, payload)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: () => this.snackBar.open('Profilo aggiornato', 'OK', { duration: 2000 }),
        error: () => this.snackBar.open('Errore aggiornamento', 'OK', { duration: 3000 })
      });
  }
}
