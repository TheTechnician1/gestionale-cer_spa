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
    this.loadImpianto(parseInt(id!));
    this.impiantiForm = this.fb.group({
    codice_cabina: ['', [Validators.required]],
    data_entrata_esercizio: ['', [Validators.required]],
    tipologia_impianto: ['', [Validators.required]],
    potenza_nominale: ['', [Validators.required]],
    presenza_accumulo: ['', [Validators.required]],
    capacita_accumulo: ['', [Validators.required]],
    tipologia_produttore: ['', [Validators.required]],
    categoria_produttore: ['', [Validators.required]],
    ubicazione_impianto: this.fb.group({
      regione: ['', [Validators.required]],
      provincia: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      comune: ['', [Validators.required]],
      indirizzo: ['', [Validators.required]],
      numero_civico: ['', [Validators.required]],
      cap: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      tipologia_sito: ['', [Validators.required]]
      })
    });
    this.impiantiForm.disable();
  }

  loadImpianto(id: number) {
    this.imp.getImpianto(id).subscribe({
      next: (impianto) => {
        this.impianto = impianto[0];
      },
      error: (err) => {
        console.log("Errore imprevisto: ", err);
      }
    })
  }
}
