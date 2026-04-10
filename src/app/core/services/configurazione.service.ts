import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiService } from "./api.service";
import { ConfigurazioneCabinaPrimaria } from "../interfaces/configurazione-cabina-primaria.model";

@Injectable({ providedIn: "root" })
export class ConfigurazioneService {
  constructor(private api: ApiService) {}

  ricerca(params?: Partial<ConfigurazioneCabinaPrimaria>): Observable<ConfigurazioneCabinaPrimaria[]> {
    return this.api.get<ConfigurazioneCabinaPrimaria[]>("configurazioni", params as Record<string, string | number | boolean> | undefined);
  }

  ricercaMock(): Observable<ConfigurazioneCabinaPrimaria[]> {
    return of([
      { id_config: "CFG-001", id_cer: "CER-001", codice_cabina: "CAB-001", anno_attivazione: "2024", flg_cancellazione: "N" },
      { id_config: "CFG-002", id_cer: "CER-002", codice_cabina: "CAB-002", anno_attivazione: "2025", flg_cancellazione: "N" },
      { id_config: "CFG-003", id_cer: "CER-003", codice_cabina: "CAB-003", anno_attivazione: "2023", flg_cancellazione: "N" },
      { id_config: "CFG-004", id_cer: "CER-004", codice_cabina: "CAB-004", anno_attivazione: "2022", flg_cancellazione: "N" },
      { id_config: "CFG-005", id_cer: "CER-005", codice_cabina: "CAB-005", anno_attivazione: "2021", flg_cancellazione: "N" },
      { id_config: "CFG-006", id_cer: "CER-006", codice_cabina: "CAB-006", anno_attivazione: "2020", flg_cancellazione: "N" },
      { id_config: "CFG-007", id_cer: "CER-007", codice_cabina: "CAB-007", anno_attivazione: "2019", flg_cancellazione: "N" },
      { id_config: "CFG-008", id_cer: "CER-008", codice_cabina: "CAB-008", anno_attivazione: "2018", flg_cancellazione: "N" },
      { id_config: "CFG-009", id_cer: "CER-009", codice_cabina: "CAB-009", anno_attivazione: "2017", flg_cancellazione: "N" },
      { id_config: "CFG-010", id_cer: "CER-010", codice_cabina: "CAB-010", anno_attivazione: "2016", flg_cancellazione: "S" },
    ]);
  }

  inserisci(payload: ConfigurazioneCabinaPrimaria): Observable<ConfigurazioneCabinaPrimaria> {
    return this.api.post<ConfigurazioneCabinaPrimaria>("configurazioni", payload);
  }

  modifica(id: string, payload: ConfigurazioneCabinaPrimaria): Observable<ConfigurazioneCabinaPrimaria> {
    return this.api.put<ConfigurazioneCabinaPrimaria>(`configurazioni/${id}`, payload);
  }

  cancella(id: string): Observable<void> {
    return this.api.delete<void>(`configurazioni/${id}`);
  }
}
