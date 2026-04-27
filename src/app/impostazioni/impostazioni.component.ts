import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DialogLogoutComponent } from '../dialog-logout/dialog-logout.component';
import { VisualTranslationService } from '../core/services/visual-translation.service';

interface LinguaDisponibile {
  codice: string;
  label: string;
}

@Component({
  selector: 'app-impostazioni',
  templateUrl: './impostazioni.component.html',
  styleUrls: ['./impostazioni.component.scss'],
})
export class ImpostazioniComponent {
  readonly lingue: LinguaDisponibile[] = [
    { codice: 'it', label: 'Italiano' },
    { codice: 'en', label: 'English' },
  ];

  linguaSelezionata = this.translate.currentLang || this.translate.defaultLang || 'it';

  constructor(
    private translate: TranslateService,
    private visualTranslation: VisualTranslationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  cambiaLingua(codiceLingua: string): void {
    this.linguaSelezionata = codiceLingua;
    localStorage.setItem('lingua', codiceLingua);
    this.translate.use(codiceLingua);
    this.visualTranslation.applyCurrentLanguage();
    this.snackBar.open('Lingua aggiornata', 'Chiudi', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  apriLogout(): void {
    this.dialog.open(DialogLogoutComponent, {
      width: '420px',
      maxWidth: '95vw',
    });
  }
}
