import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImpiantoService } from '../../services/impianto.service';
import { PermessiService } from '../../../core/services/permessi.service';
import { CodiciService } from '../../../core/services/codici.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  CodiceDescrizioneBase,
  ImpiantoDettaglio,
  ImpiantoRequest,
  STATI_IMPIANTO,
} from '../../../core/interfaces/impianto.model';

@Component({
  selector: 'app-impianti-form',
  templateUrl: './impianti-form.component.html',
  styleUrls: ['./impianti-form.component.scss'],
})
export class ImpiantiFormComponent implements OnInit {
  impiantoForm!: FormGroup;
  titoloPagina = 'Nuovo Impianto';
  isEditMode = false;
  idImpianto: string | null = null;

  private dettaglioCaricato?: ImpiantoDettaglio;

  regioni: CodiceDescrizioneBase[] = [];

  stati = STATI_IMPIANTO;
  tipologie = [
    'Fotovoltaico',
    'Agrivoltaico',
    'Eolico on-shore',
    'Eolico off-shore',
    'Idroelettrico',
    'Biogas',
    'Biomassa',
    'Altro',
  ];
  categorieProduttore = [
    'Persona Fisica',
    'Piccola/Media Impresa',
    'Comune',
    'Unione di Comuni',
    'Province/Citta Metropolitane',
    'Aziende Sanitarie Locali',
    'Altre Pubbliche Amministrazioni',
    'Enti del Terzo Settore',
    'Altro',
  ];

  @ViewChild('dlgReset') private dlgReset!: ConfirmationDialogComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private impiantoService: ImpiantoService,
    private codiciService: CodiciService,
    public permessi: PermessiService,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.idImpianto = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.idImpianto;
    this.titoloPagina = this.isEditMode ? 'Modifica Impianto' : 'Nuovo Impianto';

    this.caricaRegioni();

    if (this.isEditMode) {
      this.caricaImpianto();
    }

    this.impiantoForm.get('presenzaAccumulo')?.valueChanges.subscribe((v) => {
      const capacita = this.impiantoForm.get('capacitaAccumuloKwh');
      if (v === 'S') {
        capacita?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        capacita?.clearValidators();
      }
      capacita?.updateValueAndValidity();
    });
  }

  private caricaRegioni(): void {
    this.codiciService.list('REGIONI').subscribe((r) => (this.regioni = r ?? []));
  }

  private buildForm(): void {
    this.impiantoForm = this.fb.group({
      idConfigurazione: [null, Validators.required],
      flagEsercizio: ['SI', Validators.required],
      dataEntrataEsercizio: [null, Validators.required],
      tipologiaImpianto: [null, Validators.required],
      potenzaNominaleKw: [null, [Validators.required, Validators.min(0.01)]],
      presenzaAccumulo: ['N', Validators.required],
      capacitaAccumuloKwh: [null],
      categoriaProduttore: [null, Validators.required],
      regione: [null, Validators.required],
      provincia: [null, Validators.required],
      comune: [null, Validators.required],
      indirizzo: [null, Validators.required],
      civico: [null],
      cap: [null, [Validators.pattern(/^\d{5}$/)]],
      statoImpianto: ['ATTIVO', Validators.required],
    });
  }

  private caricaImpianto(): void {
    const id = Number(this.idImpianto);

    this.impiantoService.getById(id).subscribe({
      next: (i) => {
        if (!i) return;
        this.dettaglioCaricato = i;
        this.impiantoForm.patchValue({
          idConfigurazione: i.idConfigurazione,
          flagEsercizio: i.flagEsercizio,
          dataEntrataEsercizio: i.dataEntrataEsercizio,
          tipologiaImpianto: i.tipologiaImpianto,
          potenzaNominaleKw: i.potenzaNominaleKw,
          presenzaAccumulo: i.presenzaAccumulo,
          capacitaAccumuloKwh: i.capacitaAccumuloKwh,
          categoriaProduttore: i.categoriaProduttore,
          provincia: i.provincia,
          comune: i.comune,
          indirizzo: i.indirizzo,
          civico: i.civico,
          cap: i.cap,
          statoImpianto: i.statoImpianto,
        });
        this.preselezionaRegione(i.regione);
      },
      error: (err) => console.error('Errore caricamento impianto:', err),
    });
  }

  private preselezionaRegione(descrizione: string): void {
    this.codiciService.list('REGIONI').subscribe((regioni) => {
      this.regioni = regioni ?? [];
      const reg = this.regioni.find((r) => r.descrizione === descrizione);
      if (reg) this.impiantoForm.patchValue({ regione: reg.codice }, { emitEvent: false });
    });
  }

  private buildPayload(): ImpiantoRequest {
    const v = this.impiantoForm.getRawValue();
    const o = this.dettaglioCaricato;

    const regioneObj = this.regioni.find((r) => r.codice === v.regione) ?? null;
    const comuneObj: CodiceDescrizioneBase | null = v.comune
      ? { codice: '', descrizione: v.comune, specifica: null }
      : null;

    return {
      idConfigurazione: v.idConfigurazione,
      flagEsercizio: v.flagEsercizio,
      dataEntrataEsercizio: v.dataEntrataEsercizio,
      tipologiaImpianto: v.tipologiaImpianto,
      potenzaNominaleKw: v.potenzaNominaleKw,
      presenzaAccumulo: v.presenzaAccumulo,
      capacitaAccumuloKwh: v.capacitaAccumuloKwh ?? 0,
      categoriaProduttore: 'S',
      codiceCategoriaProduttore: v.categoriaProduttore,
      specificaTipologiaImpianto: String(o?.specificaTipologiaImpianto ?? ''),
      specificaCategoriaProduttore: String(o?.specificaCategoriaProduttore ?? ''),
      tipologiaSitoInstallazione: String(o?.tipologiaSitoInstallazione ?? ''),
      specificaSitoInstallazione: String(o?.specificaSitoInstallazione ?? ''),
      regione: regioneObj,
      provincia: v.provincia ?? '',
      comune: comuneObj,
      indirizzo: v.indirizzo ?? '',
      civico: v.civico ?? '',
      cap: v.cap ?? '',
      statoImpianto: v.statoImpianto,
      attivo: o?.attivo ?? 'S',
    };
  }

  salva(): void {
    if (this.impiantoForm.invalid) {
      this.impiantoForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();

    if (this.isEditMode) {
      const id = Number(this.idImpianto);
      this.impiantoService.modifica(id, payload).subscribe({
        next: () => this.tornaAllaLista(),
        error: (err) => console.error('Errore modifica:', err),
      });
    } else {
      this.impiantoService.inserisci(payload).subscribe({
        next: () => this.tornaAllaLista(),
        error: (err) => console.error('Errore inserimento:', err),
      });
    }
  }

  private tornaAllaLista(): void {
    this.router.navigate(['/impianto']);
  }

  chiediReset(): void {
    this.dlgReset.open();
  }

  onConfermaReset(): void {
    this.impiantoForm.reset({
      flagEsercizio: 'SI',
      presenzaAccumulo: 'N',
      statoImpianto: 'ATTIVO',
    });
  }
}
