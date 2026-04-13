import { Injectable } from '@angular/core';
import { CER } from '../interfaces/cer.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CERService {
  constructor(private http: HttpClient) {}

  private cers: CER[] = [];

  cer: CER = {
    id_cer: 0,
    ragione_sociale: '',
    codice_fiscale: '',
    partita_iva: '',
    comune_sede_legale: '',
    provincia_sede_legale: '',
    regione_legale: '',
    forma_giuridica: '',
    flag_cancellato: false,
    contatti:
    [
      {
        telefono: '',
        email: '',
        pec: '',
        sito_web: '',
        referente: ''
      }
    ]
  }

  getCERS() {
    return this.cers;
  }

  getCER(id: number) {
    this.cer = this.cers.filter(p => p.id_cer === id)[0];
    return this.cer;
  }

  createCER(cer: CER) {
    this.cers.push(cer);
    return console.log("CER creato con successo");
  }

  editCER(cer: CER) {
    this.cers = this.cers.map(p => {
      if(p.id_cer == cer.id_cer) {
        return cer;
      }
      return p;
    });
  }

  deleteCER(id: number) {
    this.cers = this.cers.filter(p => p.id_cer !== id);
    return console.log('CER eliminato con successo');
  }
}
