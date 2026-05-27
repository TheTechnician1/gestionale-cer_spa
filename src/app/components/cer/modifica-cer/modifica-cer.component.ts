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

  initForm(): void {
    this.editForm = this.fb.group({
      ragSociale: ['', [Validators.required]],
      formaGiuridica: ['', [Validators.required]],
      codFisc: ['', [Validators.required]],
      pIva: [''],
      comune: [''],
      provincia: [''],
      regione: [''],
      referente: [''],
    });
  }

  loadCerDataAndPopulateForm(): void {
    this.isLoading = true;
    this.dashboardService.getCerById(this.idCer).subscribe({
      next: (data) => {
        if (data) {
          this.originalRawData = data;

          const formaGiuridicaDesc =
            typeof data.formaGiuridica === 'object'
              ? data.formaGiuridica?.descrizione
              : data.formaGiuridica;

          const comuneObj = data.comuneLegale || data.comuneLegal;
          const comuneDesc =
            typeof comuneObj === 'object'
              ? comuneObj?.descrizione
              : comuneObj || data.comune;

          const provinciaDesc =
            typeof data.provinciaLegale === 'object'
              ? data.provinciaLegale?.descrizione
              : data.provinciaLegale || data.provincia;
          const regioneDesc =
            typeof data.regioneLegale === 'object'
              ? data.regioneLegale?.descrizione
              : data.regioneLegale || data.regione;

          this.editForm.patchValue({
            ragSociale: data.ragioneSociale || data.ragSociale || '',
            formaGiuridica: formaGiuridicaDesc || '',
            codFisc: data.codiceFiscale || data.codFisc || '',
            pIva: data.partitaIva || data.pIva || '',
            comune: comuneDesc || '',
            provincia: provinciaDesc || '',
            regione: regioneDesc || '',
            referente: data.referente || '',
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading CER for edit:', err);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;
    this.isSaving = true;

    const formValues = this.editForm.value;

    const updatedData = {
      idCer: this.idCer,
      ragSociale: formValues.ragSociale,
      codFiscale: formValues.codFisc,
      getpIva: formValues.pIva,
      email: this.originalRawData?.email || '',
      pec: this.originalRawData?.pec || '',
      sitoWeb: this.originalRawData?.sitoWeb || null,
      referente: formValues.referente,
      telefono: this.originalRawData?.telefono || null,
      flgCancellazione: this.originalRawData?.flgCancellazione || 'N',
      emailUtenteLoggato: 'utente.test@comunita.it',
      dataInserimento:
        this.originalRawData?.dataInserimento ||
        new Date().toISOString().split('T')[0],
      dataModifica: new Date().toISOString().split('T')[0],

      formaGiuridica: {
        codice: this.originalRawData?.formaGiuridica?.codice || 'ASN',
        descrizione: formValues.formaGiuridica,
        specifica: this.originalRawData?.formaGiuridica?.specifica || null,
      },
      comuneLegale: {
        codice: this.originalRawData?.comuneLegale?.codice || '',
        descrizione: formValues.comune,
        specifica: this.originalRawData?.comuneLegale?.specifica || null,
      },
      provinciaLegale: {
        codice: this.originalRawData?.provinciaLegale?.codice || '',
        descrizione: formValues.provincia,
        specifica: this.originalRawData?.provinciaLegale?.specifica || null,
      },
      regioneLegale: {
        codice: this.originalRawData?.regioneLegale?.codice || '',
        descrizione: formValues.regione,
        specifica: this.originalRawData?.regioneLegale?.specifica || null,
      },
    };

    this.dashboardService.modificaCer(updatedData).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error updating CER on live server:', err);
        this.isSaving = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
