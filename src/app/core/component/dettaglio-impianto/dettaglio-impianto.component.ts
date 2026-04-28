import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Impianto } from '../../interfaces/impianto.model';
import { ImpiantoService } from '../../services/impianto.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dettaglio-impianto',
  templateUrl: './dettaglio-impianto.component.html',
  styleUrls: ['./dettaglio-impianto.component.scss']
})
export class DettaglioImpiantoComponent implements OnInit {
  constructor(private fb: FormBuilder, private imp: ImpiantoService, private route: ActivatedRoute) {}

  impianto?: Impianto;
  impiantiForm!: FormGroup;

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
    this.impiantiForm.disable();
    this.loadImpianto(parseInt(id!));
  }

  loadImpianto(id: number) {
    this.imp.getImpianto(id).subscribe({
      next: (impianto) => {
        this.impianto = impianto[0];
        if(this.impiantiForm) {
          this.impiantiForm.patchValue({
            codiceCabina: this.impianto.configurazioneDto?.codiceCabina,
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
}
