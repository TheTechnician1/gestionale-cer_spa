import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
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

  @ViewChild('dlgReset') private dlgReset!: ConfirmationDialogComponent;

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
      annoRiferimento: [null, [Validators.required, Validators.pattern(/^\d{4}$/)]],
      energiaProdottaMhw: [null, [Validators.required, Validators.min(1)]],
      energiaPrelevataMhw: [null, [Validators.required, Validators.min(1)]],
      energiaImmessaMhw: [null, [Validators.required, Validators.min(1)]],
      energiaCondivisaMhw: [null, [Validators.required, Validators.min(1)]],
      energiaAutoconsumataMhw: [null, [Validators.required, Validators.min(1)]],
      tariffaPremioEuro: [null, [Validators.required, Validators.min(0.21)]],
      corrispettivoPremioEuro: [null, [Validators.required, Validators.min(0.21)]],
      riduzioneCo2Ton: [''],
      calcoloCo2Automatico: [true],
      note: ['', Validators.maxLength(500)],
    });

    if (this.isEditMode) {
      this.titoloPagina = this.isDettaglio
        ? 'Dettaglio Dati Energetici'
        : 'Modifica Dati Energetici';
      this.caricaDato();
    }

    this.datiEnergeticiService.ricercaCer().subscribe({
      next: (res) => (this.cers = res ?? []),
      error: (err) => console.error('Errore caricamento CER:', err),
    });

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
          energiaProdottaMhw: dato.eProdotta ?? 0,
          energiaPrelevataMhw: dato.ePrelevata ?? 0,
          energiaImmessaMhw: dato.eImmessa ?? 0,
          energiaCondivisaMhw: dato.eCondivisa ?? 0,
          energiaAutoconsumataMhw: dato.eAutoCons ?? 0,
          tariffaPremioEuro: dato.tariffaPremium ?? 0,
          corrispettivoPremioEuro: dato.corrPremioOtt ?? 0,
          riduzioneCo2Ton: dato.ridEmCo2 ?? '',
          calcoloCo2Automatico: dato.calcoloCo2Automatico ?? true,
          note: dato.note ?? '',
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
    const intero = (x: unknown) => Math.floor(Number(x ?? 0));
    const decimale = (x: unknown) => Number(x ?? 0);
    return {
      idSchedaEnergetica: this.isEditMode ? Number(this.idDatiEnergetici) : undefined,
      idCer: intero(v.idCer),
      idConfigurazione: intero(v.idConfigurazione),
      annoRiferimento: String(v.annoRiferimento ?? ''),
      energiaProdottaMhw: intero(v.energiaProdottaMhw),
      energiaPrelevataMhw: intero(v.energiaPrelevataMhw),
      energiaImmessaMhw: intero(v.energiaImmessaMhw),
      energiaCondivisaMhw: intero(v.energiaCondivisaMhw),
      energiaAutoconsumataMhw: intero(v.energiaAutoconsumataMhw),
      tariffaPremioEuro: decimale(v.tariffaPremioEuro),
      corrispettivoPremioEuro: decimale(v.corrispettivoPremioEuro),
      riduzioneCo2Ton: String(v.riduzioneCo2Ton ?? ''),
      calcoloCo2Automatico: !!v.calcoloCo2Automatico,
      note: String(v.note ?? ''),
      attivo: 'N',
    };
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

  chiediReset(): void {
    this.dlgReset.open();
  }

  onConfermaReset(): void {
    this.datiForm.reset({
      idCer: null,
      idConfigurazione: null,
      annoRiferimento: null,
      energiaProdottaMhw: null,
      energiaPrelevataMhw: null,
      energiaImmessaMhw: null,
      energiaCondivisaMhw: null,
      energiaAutoconsumataMhw: null,
      tariffaPremioEuro: null,
      corrispettivoPremioEuro: null,
      riduzioneCo2Ton: '',
      calcoloCo2Automatico: true,
      note: '',
    });
  }
}
