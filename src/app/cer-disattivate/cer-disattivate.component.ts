import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetListaCER } from '../core/interfaces/user.model';
import { CerService } from '../core/services/cer.service';
import { ConfermaPasswordDialogService } from '../core/services/conferma-password-dialog.service';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-cer-disattivate',
  templateUrl: './cer-disattivate.component.html',
  styleUrls: ['./cer-disattivate.component.scss'],
})
export class CerDisattivateComponent implements OnInit {
  formRicerca: FormGroup;
  cerDisattivate: GetListaCER[] = [];
  risultatiFiltrati: GetListaCER[] = [];
  caricamento = false;
  ricercaCompletata = false;

  private snackBar = inject(MatSnackBar);

  constructor(
    private cerService: CerService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private confermaPasswordDialog: ConfermaPasswordDialogService,
    private router: Router
  ) {
    this.formRicerca = this.formBuilder.group({
      ragioneSociale: [''],
      partitaIVA: [''],
      formaGiuridica: [''],
      comune: [''],
      provincia: [''],
      regione: [''],
    });
  }

  elencoFormaGiuridica: string[] = [
    'Associazione',
    'Associazione non riconosciuta',
    'Associazione riconosciuta',
    'Cooperativa',
    'Consorzio',
    'Fondazione di partecipazione',
    'Societa di capitali',
  ];

  ngOnInit(): void {
    this.caricaCerDisattivate();
  }

  caricaCerDisattivate(): void {
    const credenziali = this.loginService.getAccessoRequest();

    if (!credenziali) {
      this.ricercaCompletata = true;
      this.mostraMessaggio('Effettua nuovamente il login per visualizzare le CER disattivate.');
      return;
    }

    this.caricamento = true;
    this.ricercaCompletata = false;

    this.cerService.visualizzaCerDisattivate(credenziali).subscribe({
      next: (risultati) => {
        this.cerService.arricchisciCer(risultati).subscribe((cer) => {
          this.cerDisattivate = this.cerService.filtraCerDisattive(cer);
          this.applicaFiltri();
          this.caricamento = false;
          this.ricercaCompletata = true;
        });
      },
      error: (errore) => {
        this.cerDisattivate = [];
        this.risultatiFiltrati = [];
        this.caricamento = false;
        this.ricercaCompletata = true;
        this.mostraMessaggio(
          errore?.error || 'Errore durante il caricamento delle CER disattivate.'
        );
      },
    });
  }

  applicaFiltri(): void {
    this.risultatiFiltrati = this.cerService.filtraCerDisattive(
      this.cerService.filtraCer(this.cerDisattivate, {
        ragioneSociale: this.campo('ragioneSociale').value,
        partitaIVA: this.campo('partitaIVA').value,
        formaGiuridica: this.campo('formaGiuridica').value,
        comune: this.campo('comune').value,
        provincia: this.campo('provincia').value,
        regione: this.campo('regione').value,
      })
    );
  }

  resetFiltri(): void {
    this.formRicerca.reset({
      ragioneSociale: '',
      partitaIVA: '',
      formaGiuridica: '',
      comune: '',
      provincia: '',
      regione: '',
    });
    this.applicaFiltri();
  }

  campo(nome: string): FormControl {
    return this.formRicerca.get(nome) as FormControl;
  }

  visualizzaDettaglio(cer: GetListaCER): void {
    const email = this.loginService.currentUser?.email || this.loginService.getAccessoRequest()?.email;

    if (!email || !cer.idCer) {
      this.mostraMessaggio('Effettua nuovamente il login per visualizzare il dettaglio.');
      return;
    }

    this.confermaPasswordDialog
      .richiediPassword(
        'Visualizza CER disattivata',
        'Inserisci la password per visualizzare il dettaglio della CER disattivata.'
      )
      .subscribe((password) => {
        if (!password) {
          return;
        }

        this.cerService.visualizzaCerDisattivate({ email, password }).subscribe({
          next: (risultati) => {
            const dettaglio = risultati.find((item) => item.idCer === cer.idCer);

            if (!dettaglio) {
              this.mostraMessaggio('CER disattivata non trovata.');
              return;
            }

            this.router.navigate(['/cer/disattivate', cer.idCer], {
              state: { cer: dettaglio },
            });
          },
          error: (errore) => {
            this.mostraMessaggio(
              errore?.error || 'Password non corretta o dettaglio non disponibile.'
            );
          },
        });
      });
  }

  private mostraMessaggio(messaggio: string): void {
    this.snackBar.open(messaggio, 'Chiudi', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

}
