export interface CodiceDescrizioneBase {
  codice: string;
  descrizione: string;
  specifica?: string | null;
}

export type StatoImpianto =
  | 'ATTIVO'
  | 'IN_MANUTENZIONE'
  | 'SOSPESO'
  | 'DISMESSO';

export const STATI_IMPIANTO: StatoImpianto[] = [
  'ATTIVO',
  'IN_MANUTENZIONE',
  'SOSPESO',
  'DISMESSO',
];

export interface ImpiantoVista {
  idImpianto: number;
  idCer: number;
  idConfigurazione: number;
  codiceCabina: string;
  tipologiaImpianto: string;
  statoImpianto: string;
  regione: string;
  provincia: string;
  comune: string;
  potenzaNominaleKw: number;
  presenzaAccumulo: string;
  attivo: string;
}

export interface ImpiantoFiltro {
  idCer?: number | null;
  idConfigurazione?: number | null;
  codiceCabina?: string | null;
  tipologiaImpianto?: string | null;
  statoImpianto?: string | null;
  regione?: string | null;
  provincia?: string | null;
  comune?: string | null;
  presenzaAccumulo?: string | null;
  attivo?: string | null;
}

export interface ImpiantoDettaglio {
  idImpianto: number;
  idConfigurazione: number;
  flagEsercizio: string;
  dataEntrataEsercizio: string;
  tipologiaImpianto: string;
  potenzaNominaleKw: number;
  presenzaAccumulo: string;
  capacitaAccumuloKwh: number;
  categoriaProduttore: string;
  codiceCategoriaProduttore: string;
  specificaTipologiaImpianto: string | null;
  specificaCategoriaProduttore: string | null;
  tipologiaSitoInstallazione: string;
  specificaSitoInstallazione: string | null;
  regione: string;
  provincia: string;
  comune: string;
  indirizzo: string;
  civico: string;
  cap: string;
  statoImpianto: string;
  attivo: string;
}

export interface ImpiantoRequest {
  idConfigurazione: number;
  flagEsercizio: string;
  dataEntrataEsercizio: string;
  tipologiaImpianto: string;
  potenzaNominaleKw: number;
  presenzaAccumulo: string;
  capacitaAccumuloKwh: number;
  categoriaProduttore: string;
  codiceCategoriaProduttore: string;
  specificaTipologiaImpianto: string | null;
  specificaCategoriaProduttore: string | null;
  tipologiaSitoInstallazione: string;
  specificaSitoInstallazione: string | null;
  regione: CodiceDescrizioneBase | null;
  provincia: string;
  comune: CodiceDescrizioneBase | null;
  indirizzo: string;
  civico: string;
  cap: string;
  statoImpianto: string;
  attivo: string;
}
