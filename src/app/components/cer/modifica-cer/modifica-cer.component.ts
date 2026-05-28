import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-modifica-cer',
  templateUrl: './modifica-cer.component.html',
  styleUrls: ['./modifica-cer.component.scss'],
})
export class ModificaCerComponent implements OnInit {
  idCer!: number;
  editForm!: FormGroup;
  isLoading = true;
  isSaving = false;
  originalRawData: any = null;

  regioniDisponibili = [
    { codice: '03', descrizione: 'Lombardia' },
    { codice: '05', descrizione: 'Veneto' },
    { codice: '15', descrizione: 'Campania' },
    { codice: '12', descrizione: 'Lazio' },
  ];

  provinceDisponibili = [
    { codice: 'MI', descrizione: 'Milano' },
    { codice: 'PD', descrizione: 'Padova' },
    { codice: 'AV', descrizione: 'Avellino' },
    { codice: 'RM', descrizione: 'Roma' },
  ];

  comuniDisponibili = [
    { codice: '030', descrizione: 'MILANO' },
    { codice: '041', descrizione: 'PADOVA' },
    { codice: '064', descrizione: 'AVELLINO' },
    { codice: '058', descrizione: 'ROMA' },
  ];

  formeGiuridicheDisponibili = [
    { codice: 'ASN', descrizione: 'ASN - Associazione non riconosciuta' },
    { codice: 'SRL', descrizione: 'SRL - Società a responsabilità limitata' },
    { codice: 'COOP', descrizione: 'COOP - Società Cooperativa' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dashboardService: DashboardService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idCer = Number(idParam);
      this.loadCerDataAndPopulateForm();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;
    this.isSaving = true;

    const fv = this.editForm.value;

    const swaggerPayload = {
      idCer: this.idCer,
      ragSociale: fv.ragSociale,
      codFiscale: fv.codFisc,
      getpIva: fv.pIva || '',
      flgCancellazione: this.originalRawData?.flgCancellazione || 'N',
      email: fv.email || '',
      pec: fv.pec || '',
      sitoWeb: fv.sitoWeb || '',
      referente: fv.referente || '',
      telefono: fv.telefono || '',

      regioneLegale: fv.regioneObj
        ? {
            codice: fv.regioneObj.codice,
            descrizione: fv.regioneObj.descrizione,
            specifica: null,
          }
        : null,
      provinciaLegale: fv.provinciaObj
        ? {
            codice: fv.provinciaObj.codice,
            descrizione: fv.provinciaObj.descrizione,
            specifica: null,
          }
        : null,
      comuneLegale: fv.comuneObj
        ? {
            codice: fv.comuneObj.codice,
            descrizione: fv.comuneObj.descrizione,
            specifica: null,
          }
        : null,
      formaGiuridica: fv.formaGiuridicaObj
        ? {
            codice: fv.formaGiuridicaObj.codice,
            descrizione: fv.formaGiuridicaObj.descrizione,
            specifica: null,
          }
        : null,

      emailUtenteLoggato:
        this.originalRawData?.emailUtenteLoggato || 'admin@gestionale.it',
      dataInserimento:
        this.originalRawData?.dataInserimento ||
        new Date().toISOString().split('T')[0],
      dataModifica: new Date().toISOString().split('T')[0],
      dataCancellazione: this.originalRawData?.dataCancellazione || null,
    };

    this.dashboardService.modificaCer(swaggerPayload).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Save failed:', err);
        this.isSaving = false;
      },
    });
  }

  initForm(): void {
    this.editForm = this.fb.group({
      ragSociale: ['', Validators.required],
      formaGiuridicaObj: [null],
      codFisc: [''],
      pIva: [''],
      comuneObj: [null],
      provinciaObj: [null],
      regioneObj: [null],
      referente: [''],
      email: [''],
      pec: [''],
      sitoWeb: [''],
      telefono: [''],
    });
  }

  loadCerDataAndPopulateForm(): void {
    this.isLoading = true;
    this.dashboardService.getCerById(this.idCer).subscribe({
      next: (res) => {
        if (res) {
          const data = res.data || res.cer || res;
          this.originalRawData = data;

          const matchedForma =
            this.formeGiuridicheDisponibili.find(
              (f) => f.codice === data.formaGiuridica?.codice,
            ) || this.formeGiuridicheDisponibili[0];

          const matchedRegione =
            this.regioniDisponibili.find(
              (r) =>
                r.descrizione.toUpperCase() ===
                data.regioneLegale?.descrizione?.toUpperCase(),
            ) || null;
          const matchedProvincia =
            this.provinceDisponibili.find(
              (p) =>
                p.descrizione.toUpperCase() ===
                data.provinciaLegale?.descrizione?.toUpperCase(),
            ) || null;

          let matchedComune =
            this.comuniDisponibili.find(
              (c) =>
                c.descrizione.toUpperCase() ===
                data.comuneLegale?.descrizione?.toUpperCase(),
            ) || null;
          if (data.comuneLegale?.descrizione === 'LOMBARDIA') {
            matchedComune =
              this.comuniDisponibili.find((c) => c.codice === '030') || null;
          }

          this.editForm.patchValue({
            ragSociale: data.ragioneSociale || data.ragSociale || '',
            formaGiuridicaObj: matchedForma,
            codFisc: data.codiceFiscale || data.codFisc || '',
            pIva: data.partitaIva || data.pIva || '',
            comuneObj: matchedComune,
            provinciaObj: matchedProvincia,
            regioneObj: matchedRegione,
            referente: data.referente || '',
            email: data.email || '',
            pec: data.pec || '',
            sitoWeb: data.sitoWeb || '',
            telefono: data.telefono || '',
          });

          this.logInvalidFormControls();
        }
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  logInvalidFormControls() {
    const invalid = [];
    const controls = this.editForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if (invalid.length > 0) {
      console.warn(
        '⚠️ The following fields are invalid and blocking the button:',
        invalid,
      );
    } else {
      console.log('✅ Form is completely valid!');
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
