// DTO della Dashboard, allineati a /api/dashboard/*

export interface DashboardSummary {
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

export interface ImpiantiPerStato {
  stato: string;
  totale: number;
}

export interface ImpiantiPerTipologia {
  tipologia: string;
  totale: number;
}

export interface AndamentoAnno {
  anno: string;
  energiaProdotta: number;
  energiaCondivisa: number;
  energiaAutoconsumata: number;
  incentivi: number;
}

export interface TopCer {
  idCer: number;
  energiaCondivisa: number;
  incentivi: number;
}

export interface DashboardAlert {
  tipo: string;
  messaggio: string;
}
