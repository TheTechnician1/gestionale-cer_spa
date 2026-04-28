import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ImpiantoService } from '../../services/impianto.service';
import { Impianto } from '../../interfaces/impianto.model';


@Component({
  selector: 'app-modifica-impianto',
  templateUrl: './modifica-impianto.component.html',
  styleUrls: ['./modifica-impianto.component.scss']
})
export class ModificaImpiantoComponent implements OnInit {
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private impiantoService: ImpiantoService, private route: ActivatedRoute) {}

  impianto?: Impianto;
  impiantiForm!: FormGroup;
  submitted = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.impiantiForm = this.fb.group({
      codiceCabina: ['', [Validators.required]],
      annoAttivazione: ['', [Validators.required]],
      tipologia: ['', [Validators.required]],
      potenzaNominale: ['', [Validators.required]],
      flgAccumulo: ['', [Validators.required]],
      capAccumulo: ['', [Validators.required]],
      tipologiaProduttore: ['', [Validators.required]],
      specCatProduttore: ['', [Validators.required]],
      regione: [''],
      provincia: [''],
      comune: [''],
      indirizzo: [''],
      civico: [''],
      cap: [''],
      sitoInstallazione: ['']
    });
    this.impiantiForm.enable();
    this.loadImpianto(parseInt(id!));
  }

  loadImpianto(id: number) {
    this.impiantoService.getImpianto(id).subscribe({
      next: (impianto) => {
        this.impianto = impianto[0];
        if(this.impiantiForm) {
          this.impiantiForm.patchValue({
            codiceCabina: this.impianto.codiceCabina,
            annoAttivazione: this.impianto.annoAttivazione,
            tipologia: this.impianto.tipologia,
            potenzaNominale: this.impianto.potenzaNominale,
            flgAccumulo: this.impianto.flgAccumulo,
            capAccumulo: this.impianto.capAccumulo,
            tipologiaProduttore: this.impianto.tipologiaProduttore,
            specCatProduttore: this.impianto.specCatProduttore,
            regione: this.impianto.regione,
            provincia: this.impianto.provincia,
            comune: this.impianto.comune,
            indirizzo: this.impianto.indirizzo,
            civico: this.impianto.civico,
            cap: this.impianto.cap,
            sitoInstallazione: this.impianto.sitoInstallazione
          })
        }
      },
      error: (err) => {
        console.log("Errore imprevisto: ", err);
      }
    })
  }

  editImpianto(payload: any) {
    this.impiantoService.editImpianto(payload).subscribe({
      next: (res) => {
        this.snackBar.open('Modifica completata!');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteImpianto() {
    const id = { ...this.impiantiForm.value, id: this.impianto?.idImpianto }
    this.impiantoService.deleteImpianto(id).subscribe({
      next: (res) => {
        this.snackBar.open('Elimina completata!');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  submit() {
    this.submitted = true;

    if (this.impiantiForm.invalid) {
      this.impiantiForm.markAllAsTouched();
      this.snackBar.open(
        'Compila tutti i campi obbligatori correttamente',
        'Chiudi',
        {
          duration: 3000
        }
      );
      return;
    }

    this.snackBar.open(
      'Inserimento completato!',
      'OK',
      {
        duration: 2000
      }
    );
    console.log(this.impiantiForm.value);
    const payload = { ...this.impiantiForm.value, id: this.impianto?.idImpianto }
    this.editImpianto(payload);
  }
}
