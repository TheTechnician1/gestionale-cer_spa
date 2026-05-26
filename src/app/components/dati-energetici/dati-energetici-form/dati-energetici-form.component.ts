import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CerLista,
  DatiEnergeticiService,
} from '../../services/dati-energetici.service';
import { PermessiService } from '../../../core/services/permessi.service';
import { DatiEnergeticiRequest } from '../../../core/interfaces/dati-energetici.model';

@Component({
  selector: 'app-dati-energetici-form',
  templateUrl: './dati-energetici-form.component.html',
  styleUrls: ['./dati-energetici-form.component.scss'],
})
export class DatiEnergeticiFormComponent implements OnInit {
  datiForm!: FormGroup;
  titoloPagina = 'Nuovi Dati Energetici';
  isEditMode = false;
  isDettaglio = false;
  idDatiEnergetici: string | null = null;

  anni: string[] = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

  cers: CerLista[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private datiEnergeticiService: DatiEnergeticiService,
    private snackBar: MatSnackBar,
    public permessi: PermessiService,
  ) {}

  ngOnInit(): void {
    this.idDatiEnergetici = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.idDatiEnergetici;
    this.isDettaglio = this.router.url.includes('dettaglio-dati');

    this.datiForm = this.fb.group({
      idCer: [null, Validators.required],
      idConfigurazione: [null, Validators.required],
      annoRiferimento: [null, Validators.required],
      energiaProdottaMhw: [0, [Validators.required, Validators.min(0)]],
      energiaPrelevataMhw: [0, [Validators.required, Validators.min(0)]],
      energiaImmessaMhw: [0, [Validators.required, Validators.min(0)]],
      energiaCondivisaMhw: [0, [Validators.required, Validators.min(0)]],
      energiaAutoconsumataMhw: [0, [Validators.required, Validators.min(0)]],
      tariffaPremioEuro: [0, [Validators.required, Validators.min(0)]],
      corrispettivoPremioEuro: [0, [Validators.required, Validators.min(0)]],
      riduzioneCo2Ton: [''],
      calcoloCo2Automatico: [true],
      note: [''],
    });

    if (this.isEditMode) {
      this.titoloPagina = this.isDettaglio
        ? 'Dettaglio Dati Energetici'
        : 'Modifica Dati Energetici';
      this.caricaDato();
    }

    // carica la lista CER per la tendina (doc 8.1 / 14.2: prima CER poi config)
    this.datiEnergeticiService.ricercaCer().subscribe({
      next: (res) => (this.cers = res ?? []),
      error: (err) => console.error('Errore caricamento CER:', err),
    });

    // se il calcolo CO2 è automatico, il campo riduzione non è editabile (doc 9.4)
    this.datiForm.get('calcoloCo2Automatico')?.valueChanges.subscribe((auto) => {
      const rid = this.datiForm.get('riduzioneCo2Ton');
      if (auto) {
        rid?.disable({ emitEvent: false });
      } else if (!this.isDettaglio) {
        rid?.enable({ emitEvent: false });
      }
    });
  }

  private caricaDato(): void {
    const id = Number(this.idDatiEnergetici);
    this.datiEnergeticiService.getById(id).subscribe({
      next: (dato) => {
        if (!dato) return;
        this.datiForm.patchValue({
          idCer: dato.configurazioneCer?.idCer ?? null,
          idConfigurazione: dato.configurazioneCer?.idConfigurazione ?? null,
          annoRiferimento: dato.anno,
          energiaProdottaMhw: dato.geteProdotta,
          energiaPrelevataMhw: dato.getePrelevata,
          energiaImmessaMhw: dato.geteImmessa,
          energiaCondivisaMhw: dato.geteCondivisa,
          energiaAutoconsumataMhw: dato.geteAutoCons,
          tariffaPremioEuro: dato.tariffaPremium,
          corrispettivoPremioEuro: dato.corrPremioOtt,
          riduzioneCo2Ton: dato.ridEmCo2,
          calcoloCo2Automatico: dato.calcoloCo2Automatico,
          note: dato.note,
        });
        if (this.isDettaglio) {
          this.datiForm.disable();
        }
      },
      error: (err) => console.error('Errore caricamento dato', err),
    });
  }

  private buildPayload(): DatiEnergeticiRequest {
    const v = this.datiForm.getRawValue();
    const payload: DatiEnergeticiRequest = {
      idCer: v.idCer,
      idConfigurazione: v.idConfigurazione,
      annoRiferimento: v.annoRiferimento,
      energiaProdottaMhw: v.energiaProdottaMhw,
      energiaPrelevataMhw: v.energiaPrelevataMhw,
      energiaImmessaMhw: v.energiaImmessaMhw,
      energiaCondivisaMhw: v.energiaCondivisaMhw,
      energiaAutoconsumataMhw: v.energiaAutoconsumataMhw,
      tariffaPremioEuro: v.tariffaPremioEuro,
      corrispettivoPremioEuro: v.corrispettivoPremioEuro,
      riduzioneCo2Ton: v.riduzioneCo2Ton ?? '',
      calcoloCo2Automatico: v.calcoloCo2Automatico,
      note: v.note ?? '',
      attivo: 'S',
    };
    if (this.isEditMode) {
      payload.idSchedaEnergetica = Number(this.idDatiEnergetici);
    }
    return payload;
  }

  salva(): void {
    if (this.isDettaglio) return;
    if (this.datiForm.invalid) {
      this.datiForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();

    if (this.isEditMode) {
      const id = Number(this.idDatiEnergetici);
      this.datiEnergeticiService.modifica(id, payload).subscribe({
        next: () => this.tornaAllaLista(),
        error: (err) => console.error('Errore modifica:', err),
      });
      return;
    }

    // In INSERIMENTO: prima controllo che non esista già una scheda
    // per la stessa configurazione/anno (doc 14.2).
    this.datiEnergeticiService
      .checkDuplicato(payload.idConfigurazione, payload.annoRiferimento)
      .subscribe({
        next: (res) => {
          if (res.duplicato) {
            this.snackBar.open(
              res.messaggio ||
                'Esiste già una scheda energetica per questa configurazione e questo anno.',
              'OK',
              { duration: 5000 },
            );
            return;
          }
          this.datiEnergeticiService.inserisci(payload).subscribe({
            next: () => this.tornaAllaLista(),
            error: (err) => console.error('Errore inserimento:', err),
          });
        },
        error: (err) => {
          // se il check fallisce, procedo comunque con l'inserimento
          console.warn('Check duplicato fallito, procedo:', err);
          this.datiEnergeticiService.inserisci(payload).subscribe({
            next: () => this.tornaAllaLista(),
            error: (e) => console.error('Errore inserimento:', e),
          });
        },
      });
  }

  tornaAllaLista(): void {
    this.router.navigate(['/dati-energetici']);
  }

  isInvalid(field: string): boolean {
    const control = this.datiForm.get(field);
    return !!control && control.invalid && control.touched;
  }

  resetForm(): void {
    this.datiForm.reset({
      idCer: null,
      idConfigurazione: null,
      annoRiferimento: null,
      energiaProdottaMhw: 0,
      energiaPrelevataMhw: 0,
      energiaImmessaMhw: 0,
      energiaCondivisaMhw: 0,
      energiaAutoconsumataMhw: 0,
      tariffaPremioEuro: 0,
      corrispettivoPremioEuro: 0,
      riduzioneCo2Ton: '',
      calcoloCo2Automatico: true,
      note: '',
    });
  }
}
