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
    { 
      id_configurazione: "", 
      id_cer: "", 
      codice_cabina: "", 
      anno_attivazione: "" 
    }
  ];

  dataSource = this.configurazione;

  deleteConf() {

  }

  filtro = {
    codice_cabina: "", 
    anno_attivazione: "" 
  }

  listaFiltrata = [...this.configurazione];
  isFiltering = false;

  filtraConfigurazione() {
    console.log(this.filtro);
    this.listaFiltrata = this.configurazione.filter(p => {
      return (
      (this.filtro.codice_cabina ? p.codice_cabina.toLowerCase().includes(this.filtro.codice_cabina.toLowerCase()) : true) &&
      (this.filtro.anno_attivazione ? p.anno_attivazione.toLowerCase().includes(this.filtro.anno_attivazione.toLowerCase()) : true)
      );
    });

    console.log(this.listaFiltrata);

    this.isFiltering = true;

    return this.listaFiltrata;
  }

  resetFiltro() {
    this.isFiltering = false;

    this.filtro = {
      codice_cabina: "", 
      anno_attivazione: "" 
    };

    this.listaFiltrata = [...this.configurazione];
  }
}
