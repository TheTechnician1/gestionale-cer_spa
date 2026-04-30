import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from '../core/services/login.service';
import { GetListaCER } from '../core/interfaces/user.model';
import { CerService } from '../core/services/cer.service';
import { ConfermaPasswordDialogService } from '../core/services/conferma-password-dialog.service';
import { NotificheService } from '../core/services/notifiche.service';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-tabella-cer',
  templateUrl: './tabella-cer.component.html',
  styleUrls: ['./tabella-cer.component.scss'],
})
export class TabellaCERComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() risultatiFiltrati: GetListaCER[] | null = null;
  @Input() mostraInserisci = true;
  @Input() abilitaVisualizzazione = true;
  @Input() abilitaModifica = true;
  @Input() abilitaCancellazione = true;
  @Input() mostraStato = false;
  @Input() messaggioVuoto = 'Nessun elemento trovato con i filtri selezionati.';
  @Input() visualizzazioneCustom = false;
  @Output() visualizzaCer = new EventEmitter<GetListaCER>();

  displayedColumns: string[] = [
    'ragioneSociale',
    'partitaIVA',
    'formaGiuridica',
    'regioneLegale',
    'azioni',
  ];
  dataSource = new MatTableDataSource<GetListaCER>();
  formModificaCer: FormGroup;
  cerInModifica?: GetListaCER;

  constructor(
    private login: LoginService,
    private cerService: CerService,
    private snackBar: MatSnackBar,
    private confermaPasswordDialog: ConfermaPasswordDialogService,
    private notificheService: NotificheService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.formModificaCer = this.formBuilder.group({
      idCer: [null],
      ragioneSociale: ['', [Validators.required, Validators.minLength(2)]],
      codiceFiscale: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/),
        ],
      ],
      partitaIVA: ['', [Validators.pattern(/^[0-9]{11}$/)]],
      formaGiuridica: [''],
      specFormaGiuridica: [''],
      comuneSedeLegale: ['', [Validators.required]],
      provinciaSedeLegale: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}$/)]],
      regioneLegale: ['', [Validators.required]],
      referente: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern(/^(0|3)[0-9]{8,9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      pec: ['', [Validators.email]],
      sitoWeb: [''],
    });
  }
  // simone?: number
  // id = this.log.getid()
  // ruolo: string = ''

  ngOnInit(): void {
    this.aggiornaColonne();
    this.formModificaCer.get('codiceFiscale')?.valueChanges.subscribe((value) =>
      this.maiuscolo(this.campoModifica('codiceFiscale'), value)
    );
    this.formModificaCer.get('provinciaSedeLegale')?.valueChanges.subscribe((value) =>
      this.maiuscolo(this.campoModifica('provinciaSedeLegale'), value)
    );

    if (!this.risultatiFiltrati) {
      this.getTabellaCER();
    }
  }

  getRuolo(): string {
    let ruolo = this.login.currentUser?.ruolo;
    return ruolo ?? '';
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['mostraStato'] ||
      changes['abilitaVisualizzazione'] ||
      changes['abilitaModifica'] ||
      changes['abilitaCancellazione']
    ) {
      this.aggiornaColonne();
    }

    if (changes['risultatiFiltrati'] && this.risultatiFiltrati) {
      this.dataSource.data = this.risultatiFiltrati;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getTabellaCER(): void {
    this.cerService.ricercaCer().subscribe({
      next: (res) => {
        this.dataSource.data = res
      },
      error: (error) => {

      }
      
    })
  }

  puoModificare(): boolean {
    return this.abilitaModifica && this.getRuolo() === 'ADMIN';
  }

  puoCancellare(): boolean {
    return this.abilitaCancellazione && this.getRuolo() === 'ADMIN';
  }

  statoCer(cer: GetListaCER): string {
    return this.cerService.statoCer(cer);
  }

  cerDisattiva(cer: GetListaCER): boolean {
    return this.cerService.cerDisattiva(cer);
  }

  gestisciVisualizzazione(cer: GetListaCER): void {
    if (this.visualizzazioneCustom) {
      this.visualizzaCer.emit(cer);
    }
  }

  cancellaCer(cer: GetListaCER): void {
    if (!cer.idCer || !this.puoCancellare()) {
      return;
    }

    const credenziali = this.login.getAccessoRequest();
    if (!credenziali) {
      this.mostraMessaggio('Effettua nuovamente il login per completare l operazione.');
      return;
    }

    this.confermaPasswordDialog
      .richiediPassword(
        'Conferma cancellazione CER',
        'Confermi l eliminazione logica del record? Inserisci la password per procedere.'
      )
      .subscribe((password) => {
        if (!password) {
          return;
        }

        this.cerService.cancellaCer(cer.idCer!, {
          email: credenziali.email,
          password,
        }).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(
              (elemento) => elemento.idCer !== cer.idCer
            );
            this.notificheService.notificaAdmin(
              'CER cancellata',
              `Disattivata CER ${cer.ragioneSociale || cer.idCer}.`
            );
            this.mostraMessaggio('Elemento disattivato correttamente.');
          },
          error: (errore) => {
            this.mostraMessaggio(
              errore?.error || 'Errore durante la cancellazione logica della CER.'
            );
          },
        });
      });
  }

  apriModificaCer(cer: GetListaCER, template: TemplateRef<unknown>): void {
    this.cerInModifica = cer;
    this.formModificaCer.patchValue(cer);
    this.dialog.open(template, { width: '920px', maxWidth: '95vw' });
  }

  salvaModificaCer(): void {
    if (this.formModificaCer.invalid || !this.cerInModifica?.idCer) {
      this.formModificaCer.markAllAsTouched();
      this.mostraMessaggio('Correggi i campi evidenziati prima di salvare.');
      return;
    }

    const payload = {
      ...this.cerInModifica,
      ...this.formModificaCer.getRawValue(),
      idCer: this.cerInModifica.idCer,
      codiceFiscale: this.campoModifica('codiceFiscale').value?.trim().toUpperCase(),
      provinciaSedeLegale: this.campoModifica('provinciaSedeLegale').value?.trim().toUpperCase(),
      email: this.campoModifica('email').value?.trim().toLowerCase(),
      pec: this.campoModifica('pec').value?.trim().toLowerCase(),
      flgCanc: this.cerInModifica.flgCanc ?? 'N',
    } as GetListaCER;

    this.cerService.modificaCer(payload).subscribe({
      next: (risposta) => {
        this.dataSource.data = this.dataSource.data.map((cer) =>
          cer.idCer === payload.idCer ? payload : cer
        );
        this.dialog.closeAll();
        this.notificheService.notificaAdmin(
          'CER modificata',
          `Modificata CER ${payload.ragioneSociale}.`
        );
        this.mostraMessaggio(risposta || 'CER modificata correttamente.');
      },
      error: (errore) => {
        this.mostraMessaggio(errore?.error || 'Errore durante la modifica della CER.');
      },
    });
  }

  campoModifica(nome: string): FormControl {
    return this.formModificaCer.get(nome) as FormControl;
  }

  private aggiornaColonne(): void {
    const colonne = [
      'ragioneSociale',
      'partitaIVA',
      'formaGiuridica',
      'regioneLegale',
    ];

    if (this.mostraStato) {
      colonne.push('flgCanc');
    }

    if (this.abilitaVisualizzazione || this.abilitaModifica || this.abilitaCancellazione) {
      colonne.push('azioni');
    }

    this.displayedColumns = colonne;
  }

  private mostraMessaggio(messaggio: string): void {
    this.snackBar.open(messaggio, 'Chiudi', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  private maiuscolo(control: FormControl, value: unknown): void {
    if (typeof value !== 'string') {
      return;
    }

    const normalizzato = value.toUpperCase();
    if (value !== normalizzato) {
      control.setValue(normalizzato, { emitEvent: false });
    }
  }
 }
