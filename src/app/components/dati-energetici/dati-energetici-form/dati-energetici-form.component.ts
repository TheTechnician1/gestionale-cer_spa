import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private datiEnergeticiService: DatiEnergeticiService,
  ) {}

  // se id presente andiamo in modifica senno in inserimento
  ngOnInit(): void {
    this.idDatiEnergetici = this.route.snapshot.paramMap.get('id');
    this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.idDatiEnergetici;
    this.isDettaglio = this.router.url.includes('dettaglio-dati');

    this.datiForm = this.fb.group({
      idDati: [0],
      idCer: [null, Validators.required],
      idConfig: [null, Validators.required],
      anno: ['', Validators.required],
      energiaProdotta: [0, Validators.required],
      energiaPrelevata: [0, Validators.required],
      energiaImmessa: [0, Validators.required],
      energiaCondivisa: [0, Validators.required],
      energiaAutoCons: [0, Validators.required],
      tariffaPremium: [0.1, Validators.required],
      corrPremioOtt: [0.1, Validators.required],
      ridEmCo2: ['', Validators.required],
      flgCancellazione: ['N'],
      emailUtenteLoggato: ['', Validators.required],
    });
    if (this.isEditMode) {
      this.titoloPagina = this.isDettaglio
        ? 'Dettaglio Dati Energetici'
        : 'Modifica Dati Energetici';
      this.caricaDato();
    }
  }
  private caricaDato(): void {
    const id = Number(this.idDatiEnergetici);
    this.datiEnergeticiService.getDatoById(id).subscribe({
      next: (dato) => {
        if (!dato) {
          return;
        }
        this.datiForm.patchValue({
          idDati: dato.idDati,
          idCer: dato.idCer,
          anno: dato.anno,
          energiaProdotta: dato.eProdotta,
          energiaPrelevata: dato.ePrelevata,
          energiaImmessa: dato.eImmessa,
          energiaCondivisa: dato.eCondivisa,
          energiaAutoCons: dato.eAutoCons,
          tariffaPremium: dato.tariffaPremium,
        });
        if (this.isDettaglio) {
          this.datiForm.disable();
        }
      },
      error: (err) => {
        console.error('Errore caricamento dato', err);
      },
    });
  }
  salva(): void {
    if (this.isDettaglio) {
      return;
    }
    if (this.datiForm.invalid) {
      this.datiForm.markAllAsTouched();
      return;
    }
    const v = this.datiForm.value;
    const dato = {
      idDati: v.idDati,
      idCer: v.idCer,
      anno: v.anno,
      eProdotta: v.energiaProdotta,
      ePrelevata: v.energiaPrelevata,
      eImmessa: v.energiaImmessa,
      eCondivisa: v.energiaCondivisa,
      eAutoCons: v.energiaAutoCons,
      tariffaPremium: v.tariffaPremium,
      calcoloCo2Automatico: 0,
    };
    if (this.isEditMode) {
      const id = Number(this.idDatiEnergetici);
      this.datiEnergeticiService.modifica(id, dato).subscribe({
        next: () => this.tornaAllaLista(),
        error: (err) => console.error('Errore modifica:', err),
      });
    } else {
      this.datiEnergeticiService.inserisci(dato).subscribe({
        next: () => this.tornaAllaLista(),
        error: (err) => console.error('Errore inserimento:', err),
      });
    }
  }
  private tornaAllaLista(): void {
    this.router.navigate(['/dati-energetici']);
  }
  isInvalid(field: string): boolean {
    const control = this.datiForm.get(field);
    return !!control && control.invalid && control.touched;
  }
  resetForm(): void {
    this.datiForm.reset({
      idDati: 0,
      idCer: null,
      idConfig: null,
      anno: '',
      energiaProdotta: 0,
      energiaPrelevata: 0,
      energiaImmessa: 0,
      energiaCondivisa: 0,
      energiaAutoCons: 0,
      tariffaPremium: 0.1,
      corrPremioOtt: 0.1,
      ridEmCo2: '',
      flgCancellazione: 'N',
      emailUtenteLoggato: '',
    });
  }
}

// export class DatiEnergeticiFormComponent implements OnInit {
//   datiForm!: FormGroup;
//   titoloPagina = 'Nuovi Dati Energetici';
//   isEditMode = false;
//   idDatiEnergetici: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//   ) {}

//   ngOnInit(): void {
//     this.idDatiEnergetici = this.route.snapshot.paramMap.get('id');
//     this.isEditMode = !!this.idDatiEnergetici;

//     this.datiForm = this.fb.group({
//       idDati: [0],
//       idCer: [null, Validators.required],
//       idConfig: [null, Validators.required],
//       anno: ['', Validators.required],
//       energiaProdotta: [0, Validators.required],
//       energiaPrelevata: [0, Validators.required],
//       energiaImmessa: [0, Validators.required],
//       energiaCondivisa: [0, Validators.required],
//       energiaAutoCons: [0, Validators.required],
//       tariffaPremium: [0.1, Validators.required],
//       corrPremioOtt: [0.1, Validators.required],
//       ridEmCo2: ['', Validators.required],
//       flgCancellazione: ['N'],
//       emailUtenteLoggato: ['', Validators.required],
//     });

//     if (this.isEditMode) {
//       this.titoloPagina = 'Modifica Dati Energetici';
//       this.loadMockForEdit();
//     }
//   }

//   private loadMockForEdit(): void {
//     const datiMock = {
//       // idCer: 101,
//       // idConfig: 1001,
//       // anno: '2023',
//       // energiaProdotta: 125000,
//       // energiaPrelevata: 83000,
//       // energiaImmessa: 42000,
//       // energiaCondivisa: 31000,
//       // energiaAutoCons: 52000,
//       // tariffaPremium: 0.12,
//       // corrPremioOtt: 0.08,
//       // ridEmCo2: '18 tonnellate',
//       // flgCancellazione: 'N',
//       // emailUtenteLoggato: 'admin@cer.it',
//     };

//     this.datiForm.patchValue(datiMock);
//   }

//   salva(): void {
//     if (this.datiForm.invalid) {
//       this.datiForm.markAllAsTouched();
//       return;
//     }
//     const body = this.datiForm.value;
//     console.log(body);
//   }

//   isInvalid(field: string): boolean {
//     const control = this.datiForm.get(field);
//     return !!control && control.invalid && control.touched;
//   }

//   resetForm(): void {
//     this.datiForm.reset({
//       idDati: 0,
//       idCer: null,
//       idConfig: null,
//       anno: '',
//       energiaProdotta: 0,
//       energiaPrelevata: 0,
//       energiaImmessa: 0,
//       energiaCondivisa: 0,
//       energiaAutoCons: 0,
//       tariffaPremium: 0.1,
//       corrPremioOtt: 0.1,
//       ridEmCo2: '',
//       flgCancellazione: 'N',
//       emailUtenteLoggato: '',
//     });
//   }
// }
