import { Configurazione } from "./configurazione.model";

export interface DatiEnergetici {
  idDati: number | null,
  anno: string | null,
  eProdotta: number | null,
  ePrelevata: number | null,
  eImmessa: number | null,
  eCondivisa: number | null,
  eAutoCons: number | null,
  energiaProdotta: number | null,
  energiaPrelevata: number | null,
  energiaImmessa: number | null,
  energiaCondivisa: number | null,
  energiaAutoCons: number | null,
  tariffaPremium: number | null,
  corrPremioOtt: number | null,
  ridEmCo2: string | null,
  statoScheda: string | null,
  flgCancellazione: string | null,
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
  energiaProdotta: number | null;
  energiaPrelevata: number | null;
  energiaImmessa: number | null;
  energiaCondivisa: number | null;
  energiaAutoCons: number | null;
  tariffaPremium: number | null;
  corrPremioOtt: number | null;
  ridEmCo2: string | null;
  statoScheda: string | null;
  flgCancellazione: string | null;
  configurazioneCer: Configurazione | null;

  constructor(data?: Partial<DatiEnergetici>) {
    this.idDati = data?.idDati ?? null;
    this.anno = data?.anno ?? null;
    this.eProdotta = data?.eProdotta ?? null;
    this.ePrelevata = data?.ePrelevata ?? null;
    this.eImmessa = data?.eImmessa ?? null;
    this.eCondivisa = data?.eCondivisa ?? null;
    this.eAutoCons = data?.eAutoCons ?? null;
    this.energiaProdotta = data?.energiaProdotta ?? null;
    this.energiaPrelevata = data?.energiaPrelevata ?? null;
    this.energiaImmessa = data?.energiaImmessa ?? null;
    this.energiaCondivisa = data?.energiaCondivisa ?? null;
    this.energiaAutoCons = data?.energiaAutoCons ?? null;
    this.tariffaPremium = data?.tariffaPremium ?? null;
    this.corrPremioOtt = data?.corrPremioOtt ?? null;
    this.ridEmCo2 = data?.ridEmCo2 ?? null;
    this.statoScheda = data?.statoScheda ?? null;
    this.flgCancellazione = data?.flgCancellazione ?? null;
    this.configurazioneCer = data?.configurazioneCer ?? null;
  }
}

