import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stato } from '../../interfaces/stato.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CERService } from '../../services/cer.service';
import { ActivatedRoute } from '@angular/router';
import { CER } from '../../interfaces/cer.model';

@Component({
  selector: 'app-modifica-cer',
  templateUrl: './modifica-cer.component.html',
  styleUrls: ['./modifica-cer.component.scss']
})

export class ModificaCerComponent {
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private cerService: CERService, private route: ActivatedRoute) {}

  cer?: CER;
  cerForm!:FormGroup;
  stati: Stato[] = [
    { value: 'attivo', viewValue: 'Attivo'},
    { value: 'noattivo', viewValue: 'Non Attivo'}
  ]

  submitted = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.cerForm = this.fb.group({
      ragSociale: ['', [Validators.required]],
      pIva: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9\d#@èé€çòà°ù§ì£$^!(/>{}'|/`~<)-_%*?&]{8,64}$")]],
      codFiscale: ['', [Validators.required]],
      formaGiuridica: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      pec: ['', [Validators.required, Validators.email]],
      sitoWeb: ['', [Validators.required]],
      referente: ['', [Validators.required]],
      comuneLegale: ['', [Validators.required]],
      provinciaLegale: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      regioneLegale: ['', [Validators.required]],
      flgCancelllazione: ['', [Validators.required]],
    });
    this.cerForm.enable();
    this.loadCER(parseInt(id!));
  }

  loadCER(id: number) {
    this.cerService.getCER(id).subscribe({
      next: (cer) => {
      this.cer = cer[0];

      if(this.cerForm) {
        this.cerForm.patchValue({
          ragSociale: this.cer.ragSociale,
          pIva: this.cer.pIva,
          codFiscale: this.cer.codFiscale,
          formaGiuridica: this.cer.formaGiuridica?.descrizione,
          telefono: this.cer.telefono,
          email: this.cer.email,
          pec: this.cer.pec,
          sitoWeb: this.cer.sitoWeb,
          referente: this.cer.referente,
          comuneLegale: this.cer.comuneLegale?.descrizione,
          provinciaLegale: this.cer.provinciaLegale?.descrizione,
          regioneLegale: this.cer.regioneLegale?.descrizione,
          flgCancellazione: this.cer.flgCancellazione
        })
      }
      },
      error: (error) => {
        console.error("Errore caricamento CER", error);
      }
    });
  }

  submit() {
    this.submitted = true;
    if (this.cerForm.invalid) {
      this.cerForm.markAllAsTouched();

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
  }
}
