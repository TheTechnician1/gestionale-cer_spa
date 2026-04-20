import { Component } from '@angular/core';
import { DatiEnergetici } from '../../interfaces/dati-energetici.model';

@Component({
  selector: 'app-dati-energetici',
  templateUrl: './dati-energetici.component.html',
  styleUrls: ['./dati-energetici.component.scss']
})
export class DatiEnergeticiComponent {
  tableDat: string[] = ['id_dati', 'energia_prodotta', 'energia_prelevata', 'azioni'];

  datiEnergetici: DatiEnergetici[] = [
   { id_dati: "14",
     id_cer: "",
     id_config: "",
     anno: "",
     energia_prodotta: 45,
     energia_prelevata: 67,
     energia_immessa: 32,
     energia_condivisa: 57,
     energia_autoconsumata: 23,
     tariffa_premio: 56,
     corrispettivo_premio: 32,
     riduzione_emissione: ""
    }
  ]

  dataSource = this.datiEnergetici;

  deleteDat() {

  }

  filtro = {
    energia_prodotta: 0,
    energia_prelevata: 0,
    energia_immessa: 0
  };

  listaFiltrata = [...this.datiEnergetici];
  isFiltering = false;

  filtraDatiEnergetici() {
    console.log(this.filtro);
    this.listaFiltrata = this.datiEnergetici.filter(p => {
      return (
        (this.filtro.energia_prodotta ? p.energia_prodotta >= this.filtro.energia_prodotta : true) &&
        (this.filtro.energia_prelevata ? p.energia_prelevata >= this.filtro.energia_prelevata : true) &&
        (this.filtro.energia_immessa ? p.energia_immessa >= this.filtro.energia_immessa : true)
      );
    });

    console.log(this.listaFiltrata);

    this.isFiltering = true;

    return this.listaFiltrata;
  }

  resetFiltro() {
    this.isFiltering = false;

    this.filtro = {
      energia_prodotta: 0,
      energia_prelevata: 0,
      energia_immessa: 0
    };

    this.listaFiltrata = [...this.datiEnergetici];
  }
}
