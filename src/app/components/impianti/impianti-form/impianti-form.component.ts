import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImpiantoService } from '../../services/impianto.service';
import { PermessiService } from '../../../core/services/permessi.service';
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

  // dettaglio caricato in modifica: serve a preservare i "codice" dei
  // CodiceDescrizioneBase quando rimandiamo i dati al backend.
  private dettaglioCaricato?: ImpiantoDettaglio;

  stati = STATI_IMPIANTO;
  tipologie = [
    'Fotovoltaico',
    'Agrivoltaico',
    'Eolico',
    'Idroelettrico',
    'Biomassa',
    'Biogas',
    'Altro',
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private impiantoService: ImpiantoService,
    public permessi: PermessiService,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.idImpianto = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.idImpianto;
    this.titoloPagina = this.isEditMode ? 'Modifica Impianto' : 'Nuovo Impianto';

    if (this.isEditMode) {
      this.caricaImpianto();
    }

    // capacità accumulo obbligatoria solo se presenzaAccumulo = SI (doc 4.3)
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
          regione: i.regione?.descrizione,
          provincia: i.provincia?.descrizione,
          comune: i.comune?.descrizione,
          indirizzo: i.indirizzo?.descrizione,
          civico: i.civico?.descrizione,
          cap: i.cap?.descrizione,
          statoImpianto: i.statoImpianto,
        });
      },
      error: (err) => console.error('Errore caricamento impianto:', err),
    });
  }

  // Costruisce un CodiceDescrizioneBase preservando il "codice" originale
  // ricevuto dal backend (in modifica). In inserimento il codice non c'è
  // ancora: andrà popolato dalle liste /codici quando saranno disponibili.
  private toCodice(
    valore: string | null,
    originale?: CodiceDescrizioneBase,
  ): CodiceDescrizioneBase {
    return {
      codice: originale?.codice ?? '',
      descrizione: valore ?? '',
      specifica: originale?.specifica,
    };
  }

  private buildPayload(): ImpiantoRequest {
    const v = this.impiantoForm.value;
    const o = this.dettaglioCaricato;
    return {
      idConfigurazione: v.idConfigurazione,
      flagEsercizio: v.flagEsercizio,
      dataEntrataEsercizio: v.dataEntrataEsercizio,
      tipologiaImpianto: v.tipologiaImpianto,
      potenzaNominaleKw: v.potenzaNominaleKw,
      presenzaAccumulo: v.presenzaAccumulo,
      capacitaAccumuloKwh: v.capacitaAccumuloKwh ?? 0,
      categoriaProduttore: v.categoriaProduttore,
      codiceCategoriaProduttore: o?.codiceCategoriaProduttore ?? '',
      specificaTipologiaImpianto: o?.specificaTipologiaImpianto ?? '',
      specificaCategoriaProduttore: o?.specificaCategoriaProduttore ?? '',
      tipologiaSitoInstallazione: o?.tipologiaSitoInstallazione ?? '',
      specificaSitoInstallazione: o?.specificaSitoInstallazione ?? '',
      regione: this.toCodice(v.regione, o?.regione),
      provincia: this.toCodice(v.provincia, o?.provincia),
      comune: this.toCodice(v.comune, o?.comune),
      indirizzo: this.toCodice(v.indirizzo, o?.indirizzo),
      civico: this.toCodice(v.civico, o?.civico),
      cap: this.toCodice(v.cap, o?.cap),
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

  resetForm(): void {
    this.impiantoForm.reset({
      flagEsercizio: 'SI',
      presenzaAccumulo: 'N',
      statoImpianto: 'ATTIVO',
    });
  }
}
