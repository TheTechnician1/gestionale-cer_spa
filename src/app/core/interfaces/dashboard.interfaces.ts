export interface DashboardInterfaces {
  comunita: number;
  impianti: number;
  utenti: number;
  incentiviErogati: number;
  valoreIncentivi: number;
}

export interface DashboardEnergetica {

  totaleCer: number;

  configurazioniAttive: number;

  impiantiTotali: number;

  impiantiAttivi: number;

  impiantiCritici: number;

  potenzaTotale: number;

  energiaProdotta: number;

  energiaCondivisa: number;

  incentivi: number;

  co2Evitata: number;

}

export class DashboardEnergeticaViewModel implements DashboardEnergetica {
 totaleCer!: number;
  configurazioniAttive!: number;
  impiantiTotali!: number;
  impiantiAttivi!: number;
  impiantiCritici!: number;
  potenzaTotale!: number;
  energiaProdotta!: number;
  energiaCondivisa!: number;
  incentivi!: number;
  co2Evitata!: number;

  constructor(init?: Partial<DashboardEnergetica>) {
    Object.assign(this, init);
  }

}


export interface DashboardImpianti {
  tipologia:string;
  totale:number;
  stato:string;
}

export class DashboardImpiantiModel implements DashboardImpianti {
tipologia!:string;
  totale!:number;
  stato!:string;
   constructor(init?: Partial<DashboardImpianti>) {
    Object.assign(this, init);
  }
}


export interface DashboardAndamentoEnergetico {
anno:string;
energiaProdotta:number;
energiaCondivisa:number;
energiaAutoconsumata: number;
incentivi:number;
}

export class DashboardAndamentoEnergeticoModel implements DashboardAndamentoEnergetico {
anno!:string;
energiaProdotta!:number;
energiaCondivisa!:number;
energiaAutoconsumata!: number;
incentivi!:number;


   constructor(init?: Partial<DashboardAndamentoEnergetico>) {
    Object.assign(this, init);
  }
}