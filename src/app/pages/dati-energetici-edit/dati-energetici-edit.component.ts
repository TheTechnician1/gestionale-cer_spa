import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatiEnergeticiService } from 'src/app/components/services/dati-energetici.service';
import { DatiEnergetici } from 'src/app/core/interfaces/dati-energetici.model';
import { ToastService } from 'src/app/core/services/toast.service';
import { DatiEnergeticiView } from 'src/app/core/interfaces/dati-energetici-view';

@Component({
  selector: 'app-dati-energetici-edit',
  templateUrl: './dati-energetici-edit.component.html',
})
export class DatiEnergeticiEditComponent implements OnInit {

  form!: FormGroup;
  formData: DatiEnergeticiView  | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: DatiEnergeticiService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {

    // 🔧 FORM INIT
    this.form = this.fb.group({
      idDati: [null],
      anno: [null, Validators.required],
      idCer: [null, Validators.required],
      partitaIva: [null],
      idConfig: [null],
      codiceCabina: [null],
      statoScheda: [null],
      inizioAnno: [null],
      fineAnno: [null]
    });

    // 🔧 ID ROUTE
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id || isNaN(id)) {
      console.warn('ID non valido');
      return;
    }

    // 🔧 LOAD DATI
    this.service.getDato(id).subscribe({
      next: (res) => {

        console.log('RISPOSTA API:', res);

        if (res) {
          this.formData = res;

          // ✔ POPOLA FORM
          this.form.patchValue(res);
        }

      },
      error: (err) => {
        console.error('Errore caricamento dettaglio', err);
      }
    });
  }

  // 💾 SALVATAGGIO
  salvaModifica(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: DatiEnergetici = this.form.value;

    this.service.editDatiEnergetici(payload).subscribe({
      next: (res) => {

        console.log('Salvato:', res);

        this.toastService.success('✅ Modifiche salvate con successo');

      },
      error: (err) => {
        console.error('Errore salvataggio:', err);
      }
    });
  }
}