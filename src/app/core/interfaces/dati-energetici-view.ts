export interface DatiEnergeticiView {
    partitaIva: string | null;
    codiceCabina: string | null;
  idSchedaEnergetica: number | null ;
  idCer: number | null ;
  idConfigurazione: number | null ;
  annoRiferimento: string | null ;
  energiaProdottaMhw: number | null ;
  energiaPrelevataMhw: number | null ;
  energiaImmessaMhw: number | null ;
  energiaCondivisaMhw: number | null ;
  energiaAutoconsumataMhw: number | null ;
  tariffaPremioEuro: number | null ;
  corrispettivoPremioEuro: number | null ;
  riduzioneCo2Ton: string | null ;
  calcoloCo2Automatico: boolean | null ;
  note: string | null ;
  attivo: string | null ;
  emailUtenteLoggato: string | null ;
}

export class DatiEnergeticiViewModel {
  partitaIva: string | null = null;
  codiceCabina: string | null = null;
  idSchedaEnergetica: number | null = null;
  idCer: number | null = null;
  idConfigurazione: number | null = null;
  annoRiferimento: string | null = null;
  energiaProdottaMhw: number | null = null;
  energiaPrelevataMhw: number | null = null;
  energiaImmessaMhw: number | null = null;
  energiaCondivisaMhw: number | null = null;
  energiaAutoconsumataMhw: number | null = null;
  tariffaPremioEuro: number | null = null;
  corrispettivoPremioEuro: number | null = null;
  riduzioneCo2Ton: string | null = null;
  calcoloCo2Automatico: boolean | null = null;
  note: string | null = null;
  attivo: string | null = null;
  emailUtenteLoggato: string | null = null;

  constructor(init?: Partial<DatiEnergeticiViewModel>) {
    Object.assign(this, init);
  }
}
