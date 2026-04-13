import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatiEnergetici } from '../interfaces/dati-energetici.model';

@Injectable({
  providedIn: 'root'
})
export class DatiEnergeticiService {
  constructor(private http: HttpClient) { }

  dati: DatiEnergetici[] = [];

  dato: DatiEnergetici = 
  {
    id_dati: '',
    id_cer: '',
    id_config: '',
    anno: '',
    energia_prodotta: 0,
    energia_prelevata: 0,
    energia_immessa: 0,
    energia_condivisa: 0,
    energia_autoconsumata: 0,
    tariffa_premio: 0,
    corrispettivo_premio: 0,
    riduzione_emissione: ''
  }

  getDati() {
      return this.dati;
    }
  
  getDato(id: string) {
    this.dato = this.dati.filter(p => p.id_dati === id)[0];
    return this.dato;
  }
}
