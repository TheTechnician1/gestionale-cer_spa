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
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPage {
  private readonly fb = inject(FormBuilder);
  loading = false;
  error = '';
  showPassword = false;
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private readonly auth: AuthService,
    private readonly errors: ErrorService,
    readonly i18n: I18nService,
    private readonly router: Router
  ) {}

  goToSignUp(): void {
    this.router.navigate(['/sign-up']);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const value = this.form.getRawValue();
    this.auth.login({ email: value.email || '', password: value.password || '' }).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => {
        this.error = this.errors.friendly(err);
        this.loading = false;
      }
    });
  }
}
