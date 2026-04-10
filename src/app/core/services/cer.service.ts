import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiService } from "./api.service";
import { Cer } from "../interfaces/cer.model";

@Injectable({ providedIn: "root" })
export class CerService {
  constructor(private api: ApiService) {}

  ricerca(params?: Partial<Cer>): Observable<Cer[]> {
    return this.api.get<Cer[]>("cer", params as Record<string, string | number | boolean> | undefined);
  }

  ricercaMock(): Observable<Cer[]> {
    return of([
      {
        id_cer: "CER-001",
        rag_sociale: "Energia Futura",
        cod_fisc: "RSSMRA80A01H501U",
        partita_iva: "01234567890",
        comune_legale: "Roma",
        provincia_legale: "RM",
        regione_legale: "Lazio",
        forma_giuridica: "Consorzio",
        telefono: "+39 06 1234567",
        e_mail: "info@energiafutura.it",
        pec: "energiafutura@pec.it",
        sito_web: "www.energiafutura.it",
        referente: "Mario Rossi",
        flg_cancellazione: "N",
      },
      {
        id_cer: "CER-002",
        rag_sociale: "CER Nord",
        cod_fisc: "VRDLGI85C11F205Z",
        partita_iva: "09876543210",
        comune_legale: "Milano",
        provincia_legale: "MI",
        regione_legale: "Lombardia",
        forma_giuridica: "Associazione",
        telefono: "+39 02 7654321",
        e_mail: "info@cernord.it",
        pec: "cernord@pec.it",
        sito_web: "www.cernord.it",
        referente: "Luigi Verdi",
        flg_cancellazione: "N",
      },
      {
        id_cer: "CER-003",
        rag_sociale: "Energia Centro",
        cod_fisc: "BNCLGU90A01F205X",
        partita_iva: "11122233344",
        comune_legale: "Perugia",
        provincia_legale: "PG",
        regione_legale: "Umbria",
        forma_giuridica: "Cooperativa",
        telefono: "+39 075 123456",
        e_mail: "info@energiacentro.it",
        pec: "energiacentro@pec.it",
        sito_web: "www.energiacentro.it",
        referente: "Giulia Bianchi",
        flg_cancellazione: "N",
      },
      {
        id_cer: "CER-004",
        rag_sociale: "CER Sud",
        cod_fisc: "PLLFNC75B11H501Y",
        partita_iva: "55566677788",
        comune_legale: "Napoli",
        provincia_legale: "NA",
        regione_legale: "Campania",
        forma_giuridica: "Consorzio",
        telefono: "+39 081 7654321",
        e_mail: "info@cersud.it",
        pec: "cersud@pec.it",
        sito_web: "www.cersud.it",
        referente: "Francesca Palli",
        flg_cancellazione: "N",
      },
      {
        id_cer: "CER-005",
        rag_sociale: "Green Energy",
        cod_fisc: "GNRENE82C01F205Q",
        partita_iva: "22233344455",
        comune_legale: "Bologna",
        provincia_legale: "BO",
        regione_legale: "Emilia-Romagna",
        forma_giuridica: "Associazione",
        telefono: "+39 051 234567",
        e_mail: "info@greenenergy.it",
        pec: "greenenergy@pec.it",
        sito_web: "www.greenenergy.it",
        referente: "Enrico Galli",
        flg_cancellazione: "N",
      },
      {
        id_cer: "CER-006",
        rag_sociale: "CER Tirreno",
        cod_fisc: "TRRNCL68D11H501K",
        partita_iva: "33344455566",
        comune_legale: "Pisa",
        provincia_legale: "PI",
        regione_legale: "Toscana",
        forma_giuridica: "Cooperativa",
        telefono: "+39 050 987654",
        e_mail: "info@certirreno.it",
        pec: "certirreno@pec.it",
        sito_web: "www.certirreno.it",
        referente: "Claudio Neri",
        flg_cancellazione: "N",
      },
      {
        id_cer: "CER-007",
        rag_sociale: "Solare Italia",
        cod_fisc: "SLRITL88E11F205T",
        partita_iva: "44455566677",
        comune_legale: "Bari",
        provincia_legale: "BA",
        regione_legale: "Puglia",
        forma_giuridica: "Consorzio",
        telefono: "+39 080 1234567",
        e_mail: "info@solareitalia.it",
        pec: "solareitalia@pec.it",
        sito_web: "www.solareitalia.it",
        referente: "Paola Ferri",
        flg_cancellazione: "N",
      },
      {
        id_cer: "CER-008",
        rag_sociale: "CER Adriatico",
        cod_fisc: "ADRITC79F11H501M",
        partita_iva: "66677788899",
        comune_legale: "Ancona",
        provincia_legale: "AN",
        regione_legale: "Marche",
        forma_giuridica: "Associazione",
        telefono: "+39 071 765432",
        e_mail: "info@ceradriatico.it",
        pec: "ceradriatico@pec.it",
        sito_web: "www.ceradriatico.it",
        referente: "Andrea Russo",
        flg_cancellazione: "N",
      },
      {
        id_cer: "CER-009",
        rag_sociale: "Energia Alpina",
        cod_fisc: "ENRALP90G11F205R",
        partita_iva: "77788899900",
        comune_legale: "Trento",
        provincia_legale: "TN",
        regione_legale: "Trentino-Alto Adige",
        forma_giuridica: "Cooperativa",
        telefono: "+39 0461 123456",
        e_mail: "info@energiaalpina.it",
        pec: "energiaalpina@pec.it",
        sito_web: "www.energiaalpina.it",
        referente: "Marco De Luca",
        flg_cancellazione: "N",
      },
      {
        id_cer: "CER-010",
        rag_sociale: "CER Sicilia",
        cod_fisc: "CRSCLZ85H11H501S",
        partita_iva: "88899900011",
        comune_legale: "Palermo",
        provincia_legale: "PA",
        regione_legale: "Sicilia",
        forma_giuridica: "Consorzio",
        telefono: "+39 091 654321",
        e_mail: "info@cersicilia.it",
        pec: "cersicilia@pec.it",
        sito_web: "www.cersicilia.it",
        referente: "Lorenzo Costa",
        flg_cancellazione: "S",
      },
    ]);
  }

  inserisci(payload: Cer): Observable<Cer> {
    return this.api.post<Cer>("cer", payload);
  }

  modifica(id: string, payload: Cer): Observable<Cer> {
    return this.api.put<Cer>(`cer/${id}`, payload);
  }

  cancella(id: string): Observable<void> {
    return this.api.delete<void>(`cer/${id}`);
  }
}
