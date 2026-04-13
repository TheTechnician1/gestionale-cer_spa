import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Impianto } from '../interfaces/impianto.model';

@Injectable({
  providedIn: 'root'
})
export class ImpiantoService {
  constructor(private http: HttpClient) { }

  private impianti: Impianto[] = [];

  impianto: Impianto = {
    id_impianto: '',
    id_configurazione: '',
    codice_cabina: '',
    flag_impianto: false,
    data_entrata_esercizio: '',
    tipologia_impianto: '',
    potenza_nominale: '',
    presenza_accumulo: '',
    capacita_accumulo: '',
    tipologia_produttore: '',
    categoria_produttore: '',
    ubicazione_impianto: [
      {
        regione: '',
        provincia: '',
        comune: '',
        indirizzo: '',
        numero_civico: '',
        cap: '',
        tipologia_sito: ''
      }
    ]
  }

  getImpianti() {
    return this.impianti;
  }

  getImpianto(id: string) {
    this.impianto = this.impianti.filter(p => p.id_impianto === id)[0];
    return this.impianto;
  }

  createImpianto(imp: Impianto){
    this.impianti.push(imp);
    return console.log("Impianto inserito con successo");
  }

  editImpianto(imp: Impianto) {
    this.impianti = this.impianti.map(p => {
      if(p.id_impianto === imp.id_impianto) {
        return imp;
      }
      return p;
    });
  }

  deleteImpianto(id: string) {
    this.impianti = this.impianti.filter(p => p.id_impianto !== id);
    return console.log('Impianto eliminato con successo');
  }
}
