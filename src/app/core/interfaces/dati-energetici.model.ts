import { Configurazione } from "./configurazione.model";

export interface DatiEnergetici {
  idDati: number | null,
  anno: string | null,
  eProdotta: number | null,
  ePrelevata: number | null,
  eImmessa: number | null,
  eCondivisa: number | null,
  eAutoCons: number | null,
  tariffaPremium: number | null,
  corrPremioOtt: number | null,
  ridEmCo2: string | null,
  statoScheda: string | null,
  configurazioneCer: Configurazione | null
}

export class DatiEnergeticiModel implements DatiEnergetici {
  idDati: number | null;
  anno: string | null;
  eProdotta: number | null;
  ePrelevata: number | null;
  eImmessa: number | null;
  eCondivisa: number | null;
  eAutoCons: number | null;
  tariffaPremium: number | null;
  corrPremioOtt: number | null;
  ridEmCo2: string | null;
  statoScheda: string | null;
  configurazioneCer: Configurazione | null;

  constructor(data?: Partial<DatiEnergetici>) {
    this.idDati = data?.idDati ?? null;
    this.anno = data?.anno ?? null;
    this.eProdotta = data?.eProdotta ?? null;
    this.ePrelevata = data?.ePrelevata ?? null;
    this.eImmessa = data?.eImmessa ?? null;
    this.eCondivisa = data?.eCondivisa ?? null;
    this.eAutoCons = data?.eAutoCons ?? null;
    this.tariffaPremium = data?.tariffaPremium ?? null;
    this.corrPremioOtt = data?.corrPremioOtt ?? null;
    this.ridEmCo2 = data?.ridEmCo2 ?? null;
    this.statoScheda = data?.statoScheda ?? null;
    this.configurazioneCer = data?.configurazioneCer ?? null;
  }
}

