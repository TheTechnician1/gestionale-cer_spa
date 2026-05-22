export interface DatiEnergetici {
  idDati: number | null;
  idCer: number | null;
  idConfigurazione: number | null;
  anno: string | null;
  energiaProdotta: number | null;
  energiaPrelevata: number | null;
  energiaImmessa: number | null;
  energiaCondivisa: number | null;
  energiaAutoCons: number | null;
  tariffaPremium: number | null;
  corrPremioOtt: number | null;
  ridEmCo2: string | null;
  flgCancellazione: string | null;
}

export class DatiEnergeticiModel implements DatiEnergetici {
  idDati: number | null;
  idCer: number | null;
  idConfigurazione: number | null;
  anno: string | null;
  energiaProdotta: number | null;
  energiaPrelevata: number | null;
  energiaImmessa: number | null;
  energiaCondivisa: number | null;
  energiaAutoCons: number | null;
  tariffaPremium: number | null;
  corrPremioOtt: number | null;
  ridEmCo2: string | null;
  flgCancellazione: string | null;

  constructor(data?: Partial<DatiEnergetici>) {
    this.idDati = data?.idDati ?? null;
    this.idCer = data?.idCer ?? null; //  Fixed mapping typo here
    this.idConfigurazione = data?.idConfigurazione ?? null;
    this.anno = data?.anno ?? null;
    this.energiaProdotta = data?.energiaProdotta ?? null;
    this.energiaPrelevata = data?.energiaPrelevata ?? null;
    this.energiaImmessa = data?.energiaImmessa ?? null;
    this.energiaCondivisa = data?.energiaCondivisa ?? null;
    this.energiaAutoCons = data?.energiaAutoCons ?? null;
    this.tariffaPremium = data?.tariffaPremium ?? null;
    this.corrPremioOtt = data?.corrPremioOtt ?? null;
    this.ridEmCo2 = data?.ridEmCo2 ?? null;
    this.flgCancellazione = data?.flgCancellazione ?? null;
  }
}

// Represent backend contracts explicitly
export interface VistaDatiEnergeticiDto {
  idDati: number;
  anno: string;
  idCer: number;
  partitaIva: string;
  idConfig: number;
  codiceCabina: string;
  statoScheda: string;
  inizioAnno: string;
  fineAnno: string;
}

export interface DatiVisualizzaDto {
  idSchedaEnergetica: number;
  annoRiferimento: string;
  energiaProdottaMwh: number;
  energiaPrelevataMwh: number;
  energiaImmessaMwh: number;
  energiaCondivisaMwh: number;
  energiaAutoconsumataMwh: number;
  tariffaPremioEuro: number;
  corrispettivoPremioEuro: number;
  riduzioneCo2Ton: string;
  statoScheda: string;
  configurazioneCer: any;
}
