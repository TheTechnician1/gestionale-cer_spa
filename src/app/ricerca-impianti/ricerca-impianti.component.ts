import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ImpiantoCER } from '../core/interfaces/user.model';
import { ConfermaPasswordDialogService } from '../core/services/conferma-password-dialog.service';
import { ImpiantoService } from '../core/services/impianto.service';

@Component({
  selector: 'app-ricerca-impianti',
  templateUrl: './ricerca-impianti.component.html',
  styleUrls: ['./ricerca-impianti.component.scss'],
})
export class RicercaImpiantiComponent implements OnInit, AfterViewInit {
  formRicerca: FormGroup;
  formModifica: FormGroup;
  dataSource = new MatTableDataSource<ImpiantoCER>();
  impiantoSelezionato?: ImpiantoCER;
  impiantoInModifica?: ImpiantoCER;
  caricamento = false;
  ricercaEseguita = false;

  readonly displayedColumns = [
    'idImpianto',
    'codiceCabina',
    'tipologia',
    'partitaIva',
    'comune',
    'categoriaProduttore',
    'azioni',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly tipologie = [
    'Fotovoltaico',
    'Agrivoltaico',
    'Eolico on-shore',
    'Eolico off-shore',
    'Idroelettrico',
    'Biomassa',
    'Biogas',
  ];

  readonly categorieProduttore = [
    'Persona fisica',
    'Piccola/media impresa',
    'Comune',
    'Unioni di comuni',
    'Province/citta metropolitane',
    'Aziende sanitarie locali',
    'Altre pubbliche amministrazioni',
    'Enti del terzo settore',
    'Altri soggetti',
  ];

  constructor(
    private impiantoService: ImpiantoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private confermaPasswordDialog: ConfermaPasswordDialogService
  ) {
    this.formRicerca = this.impiantoService.creaFormRicerca();
    this.formModifica = this.impiantoService.creaFormImpianto();
    Object.values(this.formModifica.controls).forEach((control) => {
      control.clearValidators();
      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.cerca();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cerca(): void {
    const payload = this.impiantoService.normalizzaRicerca(this.formRicerca);

    this.caricamento = true;
    this.ricercaEseguita = false;

    this.impiantoService.ricerca(payload).subscribe({
      next: (risultati) => {
        this.dataSource.data = risultati;
        this.dataSource.paginator?.firstPage();
        this.caricamento = false;
        this.ricercaEseguita = true;
      },
      error: (errore) => {
        this.dataSource.data = [];
        this.caricamento = false;
        this.ricercaEseguita = true;
        this.mostraMessaggio(errore?.error || 'Errore durante la ricerca degli impianti.');
      },
    });
  }

  resetFiltri(): void {
    this.formRicerca.reset({
      annoAttivazioneDa: 0,
      annoAttivazioneA: 0,
      partitaIva: '',
      regione: '',
      provincia: '',
      comune: '',
      codiceCabina: '',
      codTipologia: '',
      categoriaProduttore: '',
      codTipoInst: '',
    });
    this.cerca();
  }

  apriDettaglio(impianto: ImpiantoCER, template: TemplateRef<unknown>): void {
    this.impiantoSelezionato = impianto;
    this.dialog.open(template, {
      width: '760px',
      maxWidth: '95vw',
    });
  }

  cancella(impianto: ImpiantoCER): void {
    if (!impianto.idImpianto || !this.puoCancellare()) {
      return;
    }

    this.confermaPasswordDialog
      .richiediPassword(
        'Conferma cancellazione impianto',
        'Confermi l eliminazione logica dell impianto? Inserisci la password per procedere.'
      )
      .subscribe((password) => {
        if (!password) {
          return;
        }

        if (!this.impiantoService.passwordSessioneValida(password)) {
          this.mostraMessaggio('Password non corretta.');
          return;
        }

        this.impiantoService.cancella(impianto.idImpianto!).subscribe({
          next: (risposta) => {
            this.dataSource.data = this.dataSource.data.filter(
              (elemento) => elemento.idImpianto !== impianto.idImpianto
            );
            this.mostraMessaggio(risposta || 'Elemento disattivato correttamente.');
          },
          error: (errore) => {
            this.mostraMessaggio(
              errore?.error || 'Errore durante la cancellazione logica dell impianto.'
            );
          },
        });
      });
  }

  apriModifica(impianto: ImpiantoCER, template: TemplateRef<unknown>): void {
    this.impiantoInModifica = impianto;
    this.impiantoService.popolaForm(this.formModifica, impianto);
    this.dialog.open(template, { width: '960px', maxWidth: '95vw' });
  }

  salvaModifica(): void {
    if (this.formModifica.invalid) {
      this.formModifica.markAllAsTouched();
      this.mostraMessaggio('Correggi i campi evidenziati prima di salvare.');
      return;
    }

    const payload = this.impiantoService.normalizzaModifica(this.formModifica);
    this.impiantoService.modifica(payload).subscribe({
      next: (risposta) => {
        const aggiornato = {
          ...this.impiantoInModifica,
          idImpianto: payload.idImpianto,
          idConfigurazione: payload.configurazione?.idConfig,
          codiceCabina: payload.configurazione?.codiceCabina,
          dataEsercizio: payload.dataEserc,
          codTipologia: payload.codTipologia,
          tipologia: payload.specTipologia,
          codCatProd: payload.codCatProduttore,
          categoriaProduttore: payload.specCatProduttore,
        } as ImpiantoCER;

        this.dataSource.data = this.dataSource.data.map((impianto) =>
          impianto.idImpianto === payload.idImpianto ? aggiornato : impianto
        );
        this.dialog.closeAll();
        this.mostraMessaggio(risposta || 'Impianto modificato correttamente.');
      },
      error: (errore) => {
        this.mostraMessaggio(errore?.error || 'Errore durante la modifica dell impianto.');
      },
    });
  }

  puoInserire(): boolean {
    return this.impiantoService.puoInserire();
  }

  puoModificare(): boolean {
    return this.impiantoService.puoModificare();
  }

  puoCancellare(): boolean {
    return this.impiantoService.puoCancellare();
  }

  comuneImpianto(impianto: ImpiantoCER): string {
    return this.impiantoService.comuneImpianto(impianto);
  }

  provinciaImpianto(impianto: ImpiantoCER): string {
    return this.impiantoService.provinciaImpianto(impianto);
  }

  sitoInstallazione(impianto: ImpiantoCER): string {
    return this.impiantoService.sitoInstallazione(impianto);
  }

  private mostraMessaggio(messaggio: string): void {
    this.snackBar.open(messaggio, 'Chiudi', {
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
