import { Component } from '@angular/core';
import { Impianto } from '../../interfaces/impianto.model';
import {MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-impianto',
  templateUrl: './impianto.component.html',
  styleUrls: ['./impianto.component.scss']
})
export class ImpiantoComponent {
  tableImp: string[] = ['id_impianto', 'codice_cabina', 'data_entrata_esercizio', 'azioni'];
  
  impianto: Impianto[] = [
    { id_impianto: '37', 
      id_configurazione: "", 
      codice_cabina: "7d8h2", 
      data_entrata_esercizio: "12/3/26",
      flag_impianto: false,
      tipologia_impianto: "",
      potenza_nominale: "",
      presenza_accumulo: "",
      capacita_accumulo: "",
      tipologia_produttore: "",
      categoria_produttore: "",
      ubicazione_impianto: [
        {
          regione: "",
          provincia: "",
          comune: "",
          indirizzo: "",
          numero_civico: "",
          cap: "",
          tipologia_sito: ""
        }
      ]
    }
  ]

  dataSource = this.impianto;
  

  deleteImp() {
  
  }
}
