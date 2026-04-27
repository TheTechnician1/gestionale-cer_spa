import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatiEnergetici } from '../../interfaces/dati-energetici.model';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dettaglio-dati-energetici',
  templateUrl: './dettaglio-dati-energetici.component.html',
  styleUrls: ['./dettaglio-dati-energetici.component.scss']
})
export class DettaglioDatiEnergeticiComponent implements OnInit {
  constructor(private fb: FormBuilder, private dati: DatiEnergeticiService, private route: ActivatedRoute) {}

  datiEnergetici?: DatiEnergetici;
  datiEnergeticiForm!: FormGroup;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadDati(parseInt(id!));
    this.datiEnergeticiForm = this.fb.group({
      anno: ['', [Validators.required]],
      eProdotta: ['', [Validators.required]],
      ePrelevata: ['', [Validators.required]],
      eImmessa: ['', [Validators.required]],
      eCondivisa: ['', [Validators.required]],
      eAutoCons: ['', [Validators.required]],
      tariffaPremium: ['', [Validators.required]],
      corrPremioOtt: ['', [Validators.required]],
      ridEmCo2: ['', [Validators.required]],
      statoScheda: ['']
    });
    this.datiEnergeticiForm.disable();
  }

  loadDati(id: number) {
    this.dati.getDato(id).subscribe({
      next: (dato) => {
        this.datiEnergetici = dato[0];
      },
      error: (err) => {
        console.log("Errore imprevisto: ", err);
      }
    })
  }
}
