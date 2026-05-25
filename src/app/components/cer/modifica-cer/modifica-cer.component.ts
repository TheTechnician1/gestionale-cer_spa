import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
        this.editForm.patchValue(data);
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
    const updatedData = { id: this.idCer, ...this.editForm.value };

    this.dashboardService.modificaCer(updatedData).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error updating CER:', err);
        this.isSaving = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
