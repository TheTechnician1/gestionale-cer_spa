import { Injectable } from "@angular/core";
import { Impianto } from "../../core/interfaces/impianto.model";
import { StatoImpianto } from "src/app/core/enum/stato-impianto.enum";
import { ApiRequestOptions, ApiService } from "../../core/services/api.service";
import { Observable } from "rxjs";



@Injectable({
  providedIn: "root",
})
export class ImpiantoService {
  constructor(private api: ApiService) {}

  getImpianti(params: any, options: ApiRequestOptions = {}): Observable<Impianto[]> {
    const endpoint = "api/impianti";

    return this.api.get<Impianto[]>(endpoint, params, options);
  }

  getImpianto(id: number, options: ApiRequestOptions = {}): Observable<Impianto> {
    const endpoint = `api/impianti/${id}`;
    return this.api.get<Impianto>(endpoint, undefined, options);
  }


editImpianto(payload: Impianto, options: ApiRequestOptions = {}): Observable<any> {
  const endpoint = `api/impianti/${payload.idImpianto}`;
  const email = payload.emailUtenteLoggato ?? '';
  return this.api.put<any>(endpoint, payload, { ...options, params: { emailUtenteLoggato: email } });
}

  deleteImpianto(payload: Impianto): Observable<any> {
  const endpoint = `api/impianti/${payload.idImpianto}`;

  return this.api.delete<any>(endpoint);
}

createImpianto(payload: Impianto, options: ApiRequestOptions = {}): Observable<any> {
  const endpoint = "api/impianti";
  const email = payload.emailUtenteLoggato;
  return this.api.post<any>(endpoint, payload, { ...options, params: { emailUtenteLoggato: email ?? '' } });
}
}



/*
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient } from '@angular/common/http';
//import { Impianto } from "src/app/core/interfaces/impianto.model";
//import { StatoImpianto } from "src/app/core/enum/stato-impianto.enum";

@Injectable({
  providedIn: "root",
})
export class ImpiantoService {

  private mockImpianti: Impianto[] = [
    {
      idImpianto: 1,
      idCer: 100,
      idConfigurazione: 200,
      codiceCabina: "ABC123DEF45",
      flgEsercizio: "SI",
      annoAttivazione: new Date(2024, 0, 1),
      tipologia: "FOTOVOLTAICO",
      potenzaNominale: 120.5,
      flgAccumulo: "SI",
      capAccumulo: 50,
      tipologiaProduttore: "AZIENDA",
      regione: "Campania",
      provincia: "NA",
      comune: "Napoli",
      indirizzo: "Via Roma",
      civico: "15",
      cap: "80100",
      statoImpianto: StatoImpianto.ATTIVO,
      emailUtenteLoggato: "mario.rossi@example.com",
      dataUltimaModifica: new Date(),
      utenteUltimaModifica: "mario.rossi@example.com",
      flg_cancellazione: null,
      codiceInstallazione: null,
      specificaInstallazione: null
    },
    {
      idImpianto: 2,
      idCer: 101,
      idConfigurazione: 201,
      codiceCabina: "XYZ987LMN12",
      flgEsercizio: "NO",
      annoAttivazione: new Date(2023, 5, 10),
      tipologia: "EOLICO",
      potenzaNominale: 85.2,
      flgAccumulo: "NO",
      capAccumulo: null,
      tipologiaProduttore: "PRIVATO",
      regione: "Lombardia",
      provincia: "MI",
      comune: "Milano",
      indirizzo: "Corso Buenos Aires",
      civico: "22",
      cap: "20124",
      statoImpianto: StatoImpianto.ATTIVO,
      emailUtenteLoggato: "luigi.bianchi@example.com",
      dataUltimaModifica: new Date(),
      utenteUltimaModifica: "luigi.bianchi@example.com",
      flg_cancellazione: null,
      codiceInstallazione: null,
      specificaInstallazione: null
    },
    {
      idImpianto: 3,
      idCer: 102,
      idConfigurazione: 202,
      codiceCabina: "KLM456QWE78",
      flgEsercizio: "SI",
      annoAttivazione: new Date(2022, 3, 20),
      tipologia: "IDROELETTRICO",
      potenzaNominale: 200.0,
      flgAccumulo: "SI",
      capAccumulo: 80,
      tipologiaProduttore: "AZIENDA",
      regione: "Toscana",
      provincia: "FI",
      comune: "Firenze",
      indirizzo: "Via Dante",
      civico: "8",
      cap: "50100",
      statoImpianto: StatoImpianto.ATTIVO,
      emailUtenteLoggato: "anna.verdi@example.com",
      dataUltimaModifica: new Date(),
      utenteUltimaModifica: "anna.verdi@example.com",
      flg_cancellazione: null,
      codiceInstallazione: null,
      specificaInstallazione: null
    }
  ];

  constructor(private http: HttpClient) {}

  getImpianti(payload: any): Observable<Impianto[]> {
    let risultati = [...this.mockImpianti];

    if (payload.idCer != null)
      risultati = risultati.filter(i => i.idCer === payload.idCer);

    if (payload.codiceCabina)
      risultati = risultati.filter(i => i.codiceCabina?.toLowerCase().includes(payload.codiceCabina.toLowerCase()));

    if (payload.tipologia)
      risultati = risultati.filter(i => i.tipologia?.toLowerCase() === payload.tipologia.toLowerCase());

    if (payload.statoImpianto)
      risultati = risultati.filter(i => i.statoImpianto === payload.statoImpianto);

    if (payload.regione)
      risultati = risultati.filter(i => i.regione?.toLowerCase().includes(payload.regione.toLowerCase()));

    if (payload.provincia)
      risultati = risultati.filter(i => i.provincia?.toLowerCase().includes(payload.provincia.toLowerCase()));

    if (payload.comune)
      risultati = risultati.filter(i => i.comune?.toLowerCase().includes(payload.comune.toLowerCase()));

    if (payload.potenzaNominaleMin != null)
      risultati = risultati.filter(i => (i.potenzaNominale ?? 0) >= payload.potenzaNominaleMin);

    if (payload.potenzaNominaleMax != null)
      risultati = risultati.filter(i => (i.potenzaNominale ?? 0) <= payload.potenzaNominaleMax);

    if (payload.flgAccumulo)
      risultati = risultati.filter(i => i.flgAccumulo === payload.flgAccumulo);

    if (!payload.inclusiDisattivati)
      risultati = risultati.filter(i => i.statoImpianto !== StatoImpianto.DISMESSO);

    return of(risultati);
  }

  getImpianto(id: number): Observable<Impianto> {
    const impianto = this.mockImpianti.find(i => i.idImpianto === id);
    if (impianto) {
      return of(impianto);
    }
    throw new Error(`Impianto con id ${id} non trovato`);
  }

  createImpianto(payload: Impianto): Observable<Impianto> {
    const nuovoId = Math.max(...this.mockImpianti.map(i => i.idImpianto ?? 0)) + 1;
    const nuovoImpianto = { ...payload, idImpianto: nuovoId };
    this.mockImpianti.push(nuovoImpianto);
    return of(nuovoImpianto);
  }

  editImpianto(payload: Impianto): Observable<Impianto> {
    const index = this.mockImpianti.findIndex(i => i.idImpianto === payload.idImpianto);
    if (index !== -1) {
      this.mockImpianti[index] = { ...payload };
    }
    return of(payload);
  }

  deleteImpianto(payload: Impianto): Observable<Impianto> {
    this.mockImpianti = this.mockImpianti.filter(i => i.idImpianto !== payload.idImpianto);
    return of(payload);
  }
}

*/