export interface DatiEnergetici {
  idDati: number | null;
  idCer: number | null;
  idConfig: number | null;
  anno: string | null;
  eProdotta: number | null;
  ePrelevata: number | null;
  eImmessa: number | null;
  eCondivisa: number | null;
  eAutoCons: number | null;
  tariffaPremium: number | null;
  corrPremioOtt: number | null;
  ridEmCo2: string | null;
  flgCancellazione: string | null;
  calcoloCo2Automatico: number | null;
  note: string | null;
  emailUtenteLoggato: string | null;
}

export class DatiEnergeticiModel implements DatiEnergetici {
  idDati: number | null;
  idCer: number | null;
  idConfig: number | null;
  anno: string | null;
  eProdotta: number | null;
  ePrelevata: number | null;
  eImmessa: number | null;
  eCondivisa: number | null;
  eAutoCons: number | null;
  tariffaPremium: number | null;
  corrPremioOtt: number | null;
  ridEmCo2: string | null;
  flgCancellazione: string | null;
  calcoloCo2Automatico: number | null;
  note: string | null;
  emailUtenteLoggato: string | null;

  constructor(data?: Partial<DatiEnergetici>) {
    this.idDati = data?.idDati ?? null;
    this.idCer = data?.idCer ?? null;
    this.idConfig = data?.idConfig ?? null;
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
    this.calcoloCo2Automatico = data?.calcoloCo2Automatico ?? null;
    this.note = data?.note ?? null;
    this.emailUtenteLoggato = data?.emailUtenteLoggato ?? null;
  }
}

export interface ConfigurazioneBase {
  idConfigurazione?: number;
  idCer?: number;
  codiceCabina?: string;
  [key: string]: unknown;
}

export interface DatiEnergeticiVista {
  idSchedaEnergetica: number;
  idCer: number;
  idConfigurazione: number;
  partitaIva: string;
  codiceCabina: string;
  annoRiferimento: string;
  attivo: string;
}

export interface DatiEnergeticiFiltro {
  idSchedaEnergetica?: number | null;
  annoRiferimento?: string | null;
  idCer?: number | null;
  partitaIva?: string | null;
  idConfigurazione?: number | null;
  codiceCabina?: string | null;
  attivo?: string | null;
}

export interface DatiEnergeticiDettaglio {
  idDati: number;
  anno: string;
  geteProdotta: number;
  getePrelevata: number;
  geteImmessa: number;
  geteCondivisa: number;
  geteAutoCons: number;
  tariffaPremium: number;
  corrPremioOtt: number;
  ridEmCo2: string;
  statoScheda: string;
  calcoloCo2Automatico: boolean;
  note: string;
  configurazioneCer: ConfigurazioneBase;
}

export interface DatiEnergeticiRequest {
  idSchedaEnergetica?: number;
  idCer: number;
  idConfigurazione: number;
  annoRiferimento: string;
  energiaProdottaMhw: number;
  energiaPrelevataMhw: number;
  energiaImmessaMhw: number;
  energiaCondivisaMhw: number;
  energiaAutoconsumataMhw: number;
  tariffaPremioEuro: number;
  corrispettivoPremioEuro: number;
  riduzioneCo2Ton: string;
  calcoloCo2Automatico: boolean;
  note: string;
  attivo: string;
}
