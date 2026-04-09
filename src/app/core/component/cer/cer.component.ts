import { Component } from '@angular/core';
import { CER } from '../../interfaces/cer.model';

@Component({
  selector: 'app-cer',
  templateUrl: './cer.component.html',
  styleUrls: ['./cer.component.scss']
})

export class CERComponent {
  ELEMENT_DATA: CER[] = [
    {
      id_cer: 1,
      ragione_sociale: 'Associazione Solare Bologna',
      codice_fiscale: "",
      comune_sede_legale: "",
      provincia_sede_legale: "",
      forma_giuridica: "",
      contatti: [
        {
          telefono: "",
          email: "",
          pec: "",
          sito_web: "",
          referente: ""
        }
      ],
    }
];

  displayedColumns: string[] = ['id_cer', 'ragione_sociale'];
  dataSource = this.ELEMENT_DATA;
}
