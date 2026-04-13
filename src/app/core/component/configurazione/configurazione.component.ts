import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Configurazione } from '../../interfaces/configurazione.model';

@Component({
  selector: 'app-configurazione',
  templateUrl: './configurazione.component.html',
  styleUrls: ['./configurazione.component.scss']
})
export class ConfigurazioneComponent {
  tableConf: string[] = ['id_configurazione', 'codice_cabina', 'anno_attivazione', 'azioni'];

  configurazione: Configurazione[] = [
    { id_configurazione: "", id_cer: "", codice_cabina: "", anno_attivazione: "" }
  ];

  dataSource = this.configurazione;

  deleteConf() {

  }
}
