import { Injectable } from "@angular/core";
import { Impianto, ImpiantoById, ImpiantoEdit, ImpiantoSearchFilter, ImpiantoView } from "../../core/interfaces/impianto.model";
import { ApiRequestOptions, ApiService } from "../../core/services/api.service";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ImpiantoService {
  constructor(private api: ApiService) {}

  getImpianti(payload: any, options: ApiRequestOptions = {}): Observable<Impianto[]> {
    const endpoint = "impianto/ricerca";
    return this.api.postLogin<Impianto[]>(endpoint, payload, options);
  }

  // getImpianto(id: number, options: ApiRequestOptions = {}): Observable<Impianto[]> {
  //   const endpoint = `impianto/visualizzazione/${id}`;
  //   return this.api.get<Impianto[]>(endpoint, undefined, options);
  // }


  //CHIAMATE BACK

  getAllImpianti( options: ApiRequestOptions = {}): Observable<ImpiantoView[]> {
    const endpoint = "api/impianti/";
    return this.api.get<ImpiantoView[]>(endpoint, {}, options);
  }

  getImpiantiFilter(filter: Record<string, string | number | boolean>[], options: ApiRequestOptions = {}): Observable<ImpiantoView[]> {
    const endpoint = "api/impianti/";
    console.log("filtro inviato al back: " + JSON.stringify(Object.assign({}, ...filter)));
    return this.api.get<ImpiantoView[]>(endpoint, Object.assign({}, ...filter), options);
  }

  getImpiantoById(id: number, options: ApiRequestOptions = {}): Observable<ImpiantoById> {
    const endpoint = `api/impianti/${id}`;
    return this.api.get<ImpiantoById>(endpoint, undefined, options);
  }

  createImpianto(payload: Impianto, options: ApiRequestOptions = {}): Observable<string> {
    const endpoint = "api/impianti/create";
    return this.api.postText(endpoint, payload, options);
  }

  editImpianto(id : number | undefined, payload: ImpiantoEdit, options: ApiRequestOptions = {}) {
    console.log("Impianto modificato con successo");
    const endpoint = `api/impianti/edit/${id}`;
    return this.api.putText(endpoint, payload, options);
  }

  deleteImpianto(id : number | undefined, email : string ,options: ApiRequestOptions = {}): Observable<string> {
    console.log("Impianto eliminato con successo");
    const endpoint = `api/impianti/delete/${id}`;
    return this.api.deleteText(endpoint, {email : email}, options);
  }


  //MOCK CHIAMATE
  // getImpiantiMock(): Observable<ImpiantoView[]>{
  //   return of(this.impiantiViewMock);
  // }

  // deleteImpiantoMock(id : number | undefined){
  //   console.log("Impianto eliminato con successo");
  //   this.impiantiViewMock.forEach(imp=>{
  //     if(imp.idImpianto === id) { imp.attivo = 'N' }
  //   });
  // }

  //MOCK DATI
//   impiantiViewMock: ImpiantoView[] = [
//   {
//     idImpianto: 1,
//     idConfigurazione: 101,
//     codiceCabina: 'CAB-NA-001',
//     tipologiaImpianto: 'Fotovoltaico',
//     statoImpianto: 'ATTIVO',
//     regione: 'Campania',
//     provincia: 'Napoli',
//     comune: 'Napoli',
//     potenzaNominaleKw: 12.5,
//     presenzaAccumulo: 'S',
//     attivo: 'S'
//   },
//   {
//     idImpianto: 2,
//     idConfigurazione: 102,
//     codiceCabina: 'CAB-AQ-014',
//     tipologiaImpianto: 'Eolico',
//     statoImpianto: 'IN_MANUTENZIONE',
//     regione: 'Abruzzo',
//     provincia: 'L’Aquila',
//     comune: 'Avezzano',
//     potenzaNominaleKw: 55,
//     presenzaAccumulo: 'N',
//     attivo: 'S'
//   },
//   {
//     idImpianto: 3,
//     idConfigurazione: 103,
//     codiceCabina: 'CAB-BG-120',
//     tipologiaImpianto: 'Idroelettrico',
//     statoImpianto: 'ATTIVO',
//     regione: 'Lombardia',
//     provincia: 'Bergamo',
//     comune: 'Clusone',
//     potenzaNominaleKw: 120,
//     presenzaAccumulo: 'S',
//     attivo: 'S'
//   },
//   {
//     idImpianto: 4,
//     idConfigurazione: 104,
//     codiceCabina: 'CAB-RM-045',
//     tipologiaImpianto: 'Biomassa',
//     statoImpianto: 'DISATTIVATO',
//     regione: 'Lazio',
//     provincia: 'Roma',
//     comune: 'Roma',
//     potenzaNominaleKw: 75,
//     presenzaAccumulo: 'N',
//     attivo: 'S'
//   }
// ];

}
