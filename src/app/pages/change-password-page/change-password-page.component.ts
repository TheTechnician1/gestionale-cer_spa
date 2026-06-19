import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './change-password-page.component.html',
  styleUrls: ['./change-password-page.component.scss']
})
export class ChangePasswordPage {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  hasError = false;

  constructor(readonly lang: LanguageService) {}

  submit(): void {
    if (this.newPassword.length < 8) {
      this.hasError = true;
      this.message = this.lang.t('minPasswordMessage');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.hasError = true;
      this.message = this.lang.t('passwordsDoNotMatch');
      return;
    }
    this.hasError = false;
    this.message = this.lang.t('passwordUpdated');
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
