import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configurazione } from '../interfaces/configurazione.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurazioneService {
  constructor(private http: HttpClient) { }

  private configurazioni: Configurazione[] = [];

  configurazione: Configurazione= {
    id_configurazione: '',
    id_cer: '',
    codice_cabina: '',
    anno_attivazione: ''
  }

  getConfigurazioni() {
    return this.configurazioni;
  }

  getConfigurazione(id: string) {
    this.configurazione = this.configurazioni.filter(p => p.id_configurazione === id)[0];
    return this.configurazione;
  }

  createConfigurazione(config: Configurazione){
    this.configurazioni.push(config);
    return console.log("Configurazione creata con successo");
  }

  editConfigurazione(config: Configurazione) {
    this.configurazioni = this.configurazioni.map(p => {
      if(p.id_configurazione === config.id_configurazione) {
        return config;
      }
      return p;
    });
  }

  deleteConfigurazione(id: string) {
    this.configurazioni = this.configurazioni.filter(p => p.id_configurazione !== id);
    return console.log('Utente eliminato con successo');
  }
}
