import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Configurazione } from '../../interfaces/configurazione.model';

@Component({
  selector: 'app-configurazione',
  templateUrl: './configurazione.component.html',
  styleUrls: ['./configurazione.component.scss']
})
export class ConfigurazioneComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  ELEMENT_DATA: Configurazione[] = [
    { id_configurazione: "", id_cer: "", codice_cabina: "", anno_attivazione: "" }
  ];

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
