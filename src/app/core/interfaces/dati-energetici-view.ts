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

