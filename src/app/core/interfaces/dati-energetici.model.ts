export interface DatiEnergetici {
  idDati: number | null;
  idCer: number | null;
  idConfig: number| null;
  anno: number | null;
  eProdotta: number | null;
  ePrelevata: number | null;
  eImmessa: number | null;
  eCondivisa: number | null;
  eAutoCons: number | null;
  tariffaPremium: number | null;
  corrPremioOtt: number | null;
  ridEmCo2: string | null;
  flgCancellazione: string | null;
  calcoloCo2Automatic: number | null;
  note: String| null
}

export class DatiEnergeticiModel implements DatiEnergetici {
  idDati: number | null;
  idCer: number | null;
  idConfig: number| null;
  anno: number | null;
  eProdotta: number | null;
  ePrelevata: number | null;
  eImmessa: number | null;
  eCondivisa: number | null;
  eAutoCons: number | null;
  corrPremioOtt: number | null;
  ridEmCo2: string | null;
  tariffaPremium: number | null;
  flgCancellazione: string | null;
  calcoloCo2Automatic: number | null;
  note: String| null

  constructor(data?: Partial<DatiEnergetici>) {
    this.idDati = data?.idDati ?? null;
    this.idCer = data?.idCer ?? null;
    this.idConfig= data?.idConfig ?? null;
    this.anno = data?.anno ?? null;
    this.eProdotta = data?.eProdotta ?? null;
    this.ePrelevata = data?.ePrelevata ?? null;
    this.eImmessa = data?.eImmessa ?? null;
    this.eCondivisa = data?.eCondivisa ?? null;
    this.eAutoCons = data?.eAutoCons ?? null;
    this.tariffaPremium = data?.tariffaPremium ?? null;
    this.corrPremioOtt = data?.corrPremioOtt ?? null;
    this.ridEmCo2 = data?.ridEmCo2 ?? null;
    this.flgCancellazione = data?.flgCancellazione ?? null;
    this.calcoloCo2Automatic= data?.calcoloCo2Automatic ?? null;
    this.note= data?.note ?? null
  }
}
