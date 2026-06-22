import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastService } from 'src/app/core/services/toast.service';

export function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const conferma = group.get('confermaPassword');
    const errors = { ...conferma?.errors };

    if (password !== conferma?.value) {
      conferma?.setErrors({ ...errors, passwordMismatch: true });
    } else {
      delete errors['passwordMismatch'];
      conferma?.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfermaPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.registerForm = this.fb.group(
      {
        nome: ['', Validators.required],
        cognome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern('^(?=.*[A-Z])(?=.*\\d).*$'),
          ],
        ],
        confermaPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator() },
    );
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { confermaPassword, ...payload } = this.registerForm.value;

    this.userService.registrazione(payload).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toast.error('Errore durante la registrazione');
      },
    });
  }
}
