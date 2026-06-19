import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../services/i18n.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './support-page.component.html',
  styleUrls: ['./support-page.component.scss']
})
export class SupportPage {
  email = '';
  message = '';
  sent = false;

  constructor(readonly i18n: I18nService) {}
}
