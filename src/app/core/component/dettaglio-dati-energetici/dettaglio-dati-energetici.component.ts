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
      id_cer: ['', [Validators.required]],
      id_config: ['', [Validators.required]],
      anno: ['', [Validators.required]],
      energia_prodotta: ['', [Validators.required]],
      energia_prelevata: ['', [Validators.required]],
      energia_immessa: ['', [Validators.required]],
      energia_condivisa: ['', [Validators.required]],
      energia_autoconsumata: ['', [Validators.required]],
      tariffa_premio: ['', [Validators.required]],
      corrispettivo_premio: ['', [Validators.required]],
      riduzione_emissione: ['', [Validators.required]]
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
