import { Injectable } from "@angular/core";
import { DatiEnergetici } from "../../core/interfaces/dati-energetici.model";
import { ApiRequestOptions, ApiService } from "../../core/services/api.service";
import { Observable, of } from "rxjs";
import { DatiEnergeticiView } from "src/app/core/interfaces/dati-energetici-view";

@Injectable({
  providedIn: "root",
})
export class DatiEnergeticiService {
  constructor(private api: ApiService) {}

    private MOCK_DATI: DatiEnergeticiView[] = [
   {
    idDati: 1,
    anno: "2025",
    idCer: 2,
    partitaIva: "12345678901",
    idConfig: 10,
    codiceCabina: "CAB-001",
    statoScheda: "OK",
    inizioAnno: "2025-01-01",
    fineAnno: "2025-12-31"
  },
  {
    idDati: 2,
    anno: "2024",
    idCer: 3,
    partitaIva: "10987654321",
    idConfig: 11,
    codiceCabina: "CAB-002",
    statoScheda: "DA_VERIFICARE",
    inizioAnno: "2024-01-01",
    fineAnno: "2024-12-31"
  },
  {
    idDati: 3,
    anno: "2023",
    idCer: null,
    partitaIva: null,
    idConfig: 12,
    codiceCabina: "CAB-003",
    statoScheda: "IN_BOZZA",
    inizioAnno: "2023-01-01",
    fineAnno: "2023-12-31"
  }
];
  
  getDati(payload: any, options: ApiRequestOptions = {}): Observable<DatiEnergetici[]> {
    const endpoint = "datiEnergetici/ricerca";
    return this.api.postLogin<DatiEnergetici[]>(endpoint, payload, options);
  }



// getDato(id: number, options: ApiRequestOptions = {}): Observable<DatiEnergetici[]> {
//      const endpoint = `datiEnergetici/visualizza/${id}`;
//      return this.api.get<DatiEnergetici[]>(endpoint, undefined, options);

getDato(id: number): Observable<DatiEnergeticiView> {
  const dato: DatiEnergeticiView | undefined =
    this.MOCK_DATI.find(d => d.idDati === id);

  if (!dato) {
    throw new Error("Dato non trovato");
  }

  return of(dato);

}
  createDatiEnergetici(payload: DatiEnergetici, options: ApiRequestOptions = {}): Observable<DatiEnergetici> {
    console.log("Dati Energetici creati con successo");
    const endpoint = "datiEnergetici/inserimento";
    return this.api.post<DatiEnergetici>(endpoint, payload, options);
  }

  
    editDatiEnergetici(
  payload: DatiEnergetici,
  options: ApiRequestOptions = {}
): Observable<DatiEnergetici> {

  console.log("MOCK SALVATAGGIO:", payload);

  return of(payload);
}

  deleteDatiEnergetici(payload: any, options: ApiRequestOptions = {}): Observable<DatiEnergetici> {
    console.log("Dati Energetici eliminati con successo");
    const endpoint = "datiEnergetici/disattiva";
    return this.api.put<DatiEnergetici>(endpoint, payload, options);
  }

}
