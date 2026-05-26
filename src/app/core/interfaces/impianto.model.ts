export interface CodiceDescrizioneBase {
  codice: string;
  descrizione: string;
  specifica?: string;
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
  specificaTipologiaImpianto: string;
  specificaCategoriaProduttore: string;
  tipologiaSitoInstallazione: string;
  specificaSitoInstallazione: string;
  // Possono arrivare null dal backend e vanno rimandati null se non abbiamo
  // il codice reale (altrimenti il backend risponde 500).
  regione: CodiceDescrizioneBase | null;
  provincia: CodiceDescrizioneBase | null;
  comune: CodiceDescrizioneBase | null;
  indirizzo: CodiceDescrizioneBase | null;
  civico: CodiceDescrizioneBase | null;
  cap: CodiceDescrizioneBase | null;
  statoImpianto: string;
  attivo: string;
}

export interface ImpiantoRequest extends Omit<
  ImpiantoDettaglio,
  'idImpianto'
> {}
