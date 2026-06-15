import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UtenteService } from '../../services/utente.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  constructor(private fb: FormBuilder, private auth: UtenteService, private route: ActivatedRoute, private router: Router) {}
  requestForm!: FormGroup;
  resetForm!: FormGroup;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  hasToken = false;
  userEmail: string | null = null;
  showLoginLink: boolean = false;

  ngOnInit() {
    this.initForms();
    this.route.queryParamMap.subscribe(params => {
      const email = params.get('email');
      if(email) {
        this.userEmail = email;
        this.hasToken = true;
        this.patchResetFormEmail(email);
      } else {
        this.hasToken = false;
        this.userEmail = null;
      }
    });
  }

  private initForms() {
    this.requestForm = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
    this.resetForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,64}$")]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  private passwordsMatch(group: AbstractControl | null) {
    if(!group) return null;
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
  }

  private patchResetFormEmail(email: string): void {
    if (!this.resetForm) this.initForms();
    this.resetForm.patchValue({ email });
  }

  get email(): string | null {
    return this.userEmail;
  }

  sendResetEmail(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';
    const email = this.requestForm.value.email;

    this.auth.requestPasswordReset(email)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.messageType = 'success';
          this.message = 'Se l\'email è registrata, riceverai a breve il link per reimpostare la password.';
        },
        error: err => {
          this.messageType = 'error';
          this.message = err?.error?.message || 'Errore durante l\'invio. Riprova più tardi.';
        }
      });
  }

  resetPassword(): void {
    if (this.resetForm.invalid || !this.email) {
      this.resetForm.markAllAsTouched();
      if(!this.email) {
        this.messageType = 'error';
        this.message = 'Email mancante nel link. Riprova richiedendo un nuovo link.';
      }
      return;
    }
    this.loading = true;
    this.message = '';

    const payload = { email: this.email, password: this.resetForm.get('password')?.value };
    this.auth.resetPassword(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.messageType = 'success';
          this.message = 'Password reimpostata con successo. Verrai reindirizzato al login.';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: err => {
          this.messageType = 'error';
          this.message = err?.error?.message || 'Errore durante il reset. Riprova.';
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
