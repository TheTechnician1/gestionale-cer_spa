import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  standalone: true,
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPage {
  readonly lang = inject(LanguageService);
}
