import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPage {
  private readonly fb = inject(FormBuilder);
  loading = false;
  error = '';
  showPassword = false;
  form = this.fb.group({
    nome: ['', Validators.required],
    cognome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    saldo: [0, [Validators.required, Validators.min(0)]]
  }, { updateOn: 'blur' });

  constructor(
    private readonly auth: AuthService,
    private readonly errors: ErrorService,
    readonly i18n: I18nService,
    private readonly router: Router
  ) {}

  goToSignIn(): void {
    this.router.navigate(['/sign-in']);
  }

  showFieldError(controlName: 'nome' | 'cognome' | 'email' | 'password' | 'saldo'): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.invalid;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const value = this.form.getRawValue();
    this.auth.register({
      nome: value.nome || '',
      cognome: value.cognome || '',
      email: value.email || '',
      password: value.password || '',
      saldo: Number(value.saldo || 0)
    }).subscribe({
      next: () => this.router.navigate(['/sign-in']),
      error: (err) => {
        this.error = this.errors.friendly(err);
        this.loading = false;
      }
    });
  }
}
