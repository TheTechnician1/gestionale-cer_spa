export interface DatiEnergeticiView {
  partitaIva: string;
  codiceCabina: string;
  idSchedaEnergetica: number ;
  idCer: number ;
  idConfigurazione: number ;
  annoRiferimento: string ;
  energiaProdottaMhw: number ;
  energiaPrelevataMhw: number ;
  energiaImmessaMhw: number ;
  energiaCondivisaMhw: number ;
  energiaAutoconsumataMhw: number ;
  tariffaPremioEuro: number ;
  corrispettivoPremioEuro: number ;
  riduzioneCo2Ton: string ;
  calcoloCo2Automatico: boolean ;
  note: string ;
  attivo: string ;
  emailUtenteLoggato: string ;
}

export class DatiEnergeticiViewModel {
  partitaIva!: string;
  codiceCabina!: string;
  idSchedaEnergetica!: number;
  idCer!: number;
  idConfigurazione!: number;
  annoRiferimento!: string;
  energiaProdottaMhw!: number;
  energiaPrelevataMhw!: number;
  energiaImmessaMhw!: number;
  energiaCondivisaMhw!: number;
  energiaAutoconsumataMhw!: number;
  tariffaPremioEuro!: number;
  corrispettivoPremioEuro!: number;
  riduzioneCo2Ton!: string;
  calcoloCo2Automatico!: boolean;
  note!: string;
  attivo!: string;
  emailUtenteLoggato!: string;

  constructor(init?: Partial<DatiEnergeticiViewModel>) {
    Object.assign(this, init);
  }
}

export interface DatiEnergeticiInserimento {
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

  configurazioneCer: {
    idConfigurazione: number;

    cer: {
      idCer: number;
      ragSociale: string;
      codFiscale: string;
      getpIva: string;
      flgCancellazione: string;
      email: string;
      pec: string;
      sitoWeb: string;
      referente: string;
      telefono: string;

      regioneLegale: {
        codice: string;
        descrizione: string;
        specifica: string;
      };

      provinciaLegale: {
        codice: string;
        descrizione: string;
        specifica: string;
      };

      comuneLegale: {
        codice: string;
        descrizione: string;
        specifica: string;
      };

      formaGiuridica: {
        codice: string;
        descrizione: string;
        specifica: string;
      };

      emailUtenteLoggato: string;
      dataInserimento: string;
      dataModifica: string;
      dataCancellazione: string;
    };

    codiceCabina: string;
    annoAttivazione: string;
    idCer: number;
    emailUtenteLoggato: string;
    flg_cancellazione: string;
  };
}

  export class DatiEnergeticiInserimento {
  idDati!: number;
  anno!: string;
  geteProdotta!: number;
  getePrelevata!: number;
  geteImmessa!: number;
  geteCondivisa!: number;
  geteAutoCons!: number;
  tariffaPremium!: number;
  corrPremioOtt!: number;
  ridEmCo2!: string;
  statoScheda!: string;
  calcoloCo2Automatico!: boolean;
  note!: string;
  idConfigurazione!: number;

    
      idCer!: number;
      ragSociale!: string;
      codFiscale!: string;
      getpIva!: string;
      flgCancellazione!: string;
      email!: string;
      pec!: string;
      sitoWeb!: string;
      referente!: string;
      telefono!: string;

        codice!: string;
        descrizione!: string;
        specifica!: string;
    
      emailUtenteLoggato!: string;
      dataInserimento!: string;
      dataModifica!: string;
      dataCancellazione!: string;
    

    codiceCabina!: string;
    annoAttivazione!: string;
    flg_cancellazione!: string;

     constructor(init?: Partial<DatiEnergeticiInserimento>) {
    Object.assign(this, init);
  }
  };
  
  


