import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatiEnergeticiService } from 'src/app/components/services/dati-energetici.service';
import { DatiEnergetici } from 'src/app/core/interfaces/dati-energetici.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-dati-energetici-edit',
  templateUrl: './dati-energetici-edit.component.html',
})
export class DatiEnergeticiEditComponent implements OnInit {

  formData: DatiEnergetici | null = null;


  constructor(
    private route: ActivatedRoute,
    private service: DatiEnergeticiService,
    private snackBar: MatSnackBar,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id || isNaN(id)) {
      console.warn("ID non valido");
      return;
    }

    this.service.getDato(id).subscribe({
      next: (res) => {

        console.log("RISPOSTA API:", res);

       this.formData = res?.[0] ?? null;

console.log("formData:", this.formData);

        console.log("FORM DATA:", this.formData);
      },
      error: (err) => {
        console.error("Errore caricamento dettaglio", err);
      }
    });
  }

 salvaModifica(): void {

  if (!this.formData) return;

  this.service.editDatiEnergetici(this.formData).subscribe({

    next: (res) => {

      console.log("Salvato:", res);

 this.toastService.success('✅ Modifiche salvate con successo');

    },

    error: (err) => {
      console.error(err);
    }

  });
}
}