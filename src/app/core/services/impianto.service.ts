import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiService } from "./api.service";
import { Impianto } from "../interfaces/impianto.model";

@Injectable({ providedIn: "root" })
export class ImpiantoService {
  constructor(private api: ApiService) {}

  ricerca(params?: Partial<Impianto>): Observable<Impianto[]> {
    return this.api.get<Impianto[]>("impianti", params as Record<string, string | number | boolean> | undefined);
  }

  ricercaMock(): Observable<Impianto[]> {
    return of([
      { id_impianto: "IMP-001", id_configurazione: "CFG-001", flg_esercizio: "S", data_eserc: "2024-01-10", cod_tipologia: "FV", pre_nom: "120", flg_accumulo: "S", cap_accumulo: "50.0", tipo_produttore: "A", cod_cat_prod: "CAT-01", flg_cancellazione: "N" },
      { id_impianto: "IMP-002", id_configurazione: "CFG-002", flg_esercizio: "S", data_eserc: "2023-07-12", cod_tipologia: "EOL", pre_nom: "80", flg_accumulo: "N", cap_accumulo: "0", tipo_produttore: "B", cod_cat_prod: "CAT-02", flg_cancellazione: "N" },
      { id_impianto: "IMP-003", id_configurazione: "CFG-003", flg_esercizio: "N", data_eserc: "2022-03-20", cod_tipologia: "FV", pre_nom: "60", flg_accumulo: "S", cap_accumulo: "20.0", tipo_produttore: "A", cod_cat_prod: "CAT-01", flg_cancellazione: "N" },
      { id_impianto: "IMP-004", id_configurazione: "CFG-004", flg_esercizio: "S", data_eserc: "2021-11-02", cod_tipologia: "IDR", pre_nom: "40", flg_accumulo: "N", cap_accumulo: "0", tipo_produttore: "C", cod_cat_prod: "CAT-03", flg_cancellazione: "N" },
      { id_impianto: "IMP-005", id_configurazione: "CFG-005", flg_esercizio: "S", data_eserc: "2020-08-15", cod_tipologia: "FV", pre_nom: "150", flg_accumulo: "S", cap_accumulo: "70.0", tipo_produttore: "A", cod_cat_prod: "CAT-01", flg_cancellazione: "N" },
      { id_impianto: "IMP-006", id_configurazione: "CFG-006", flg_esercizio: "S", data_eserc: "2019-05-05", cod_tipologia: "EOL", pre_nom: "90", flg_accumulo: "N", cap_accumulo: "0", tipo_produttore: "B", cod_cat_prod: "CAT-02", flg_cancellazione: "N" },
      { id_impianto: "IMP-007", id_configurazione: "CFG-007", flg_esercizio: "N", data_eserc: "2018-02-18", cod_tipologia: "IDR", pre_nom: "55", flg_accumulo: "N", cap_accumulo: "0", tipo_produttore: "C", cod_cat_prod: "CAT-03", flg_cancellazione: "N" },
      { id_impianto: "IMP-008", id_configurazione: "CFG-008", flg_esercizio: "S", data_eserc: "2017-10-30", cod_tipologia: "FV", pre_nom: "110", flg_accumulo: "S", cap_accumulo: "40.0", tipo_produttore: "A", cod_cat_prod: "CAT-01", flg_cancellazione: "N" },
      { id_impianto: "IMP-009", id_configurazione: "CFG-009", flg_esercizio: "S", data_eserc: "2016-09-09", cod_tipologia: "EOL", pre_nom: "75", flg_accumulo: "N", cap_accumulo: "0", tipo_produttore: "B", cod_cat_prod: "CAT-02", flg_cancellazione: "N" },
      { id_impianto: "IMP-010", id_configurazione: "CFG-010", flg_esercizio: "N", data_eserc: "2015-01-01", cod_tipologia: "FV", pre_nom: "30", flg_accumulo: "N", cap_accumulo: "0", tipo_produttore: "A", cod_cat_prod: "CAT-01", flg_cancellazione: "S" },
    ]);
  }

  inserisci(payload: Impianto): Observable<Impianto> {
    return this.api.post<Impianto>("impianti", payload);
  }

  modifica(id: string, payload: Impianto): Observable<Impianto> {
    return this.api.put<Impianto>(`impianti/${id}`, payload);
  }

  cancella(id: string): Observable<void> {
    return this.api.delete<void>(`impianti/${id}`);
  }
}
