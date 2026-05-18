import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: "app-dati-energetici-form",
  templateUrl: "./dati-energetici-form.component.html",
  styleUrls: ["./dati-energetici-form.component.scss"],
})
export class DatiEnergeticiFormComponent implements OnInit {

  datiForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

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

      emailUtenteLoggato: ['', Validators.required]
    });
  }

  salva(): void {

    if (this.datiForm.invalid) {
      this.datiForm.markAllAsTouched();
      return;
    }

    const body = this.datiForm.value;

    console.log(body);

    // this.service.inserisci(body).subscribe(...)
  }

  isInvalid(field: string): boolean {

    const control = this.datiForm.get(field);

    return !!control && control.invalid && control.touched;
  }
}