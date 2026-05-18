import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatiEnergeticiService } from 'src/app/components/services/dati-energetici.service';
import { DatiEnergetici } from 'src/app/core/interfaces/dati-energetici.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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

        // ✅ FIX: il service ritorna ARRAY
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

     this.snackBar.open(
  '✅ Modifiche salvate con successo',
  'Chiudi',
  {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['success-snackbar']
  }
);

    },

    error: (err) => {
      console.error(err);
    }

  });
}
}