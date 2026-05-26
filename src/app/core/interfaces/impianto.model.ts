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

// LISTA -> GET /api/impianti/ (VistaImpiantoResponseDTO)
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
  presenzaAccumulo: string; // 'SI'/'NO'
  attivo: string;
}

// Filtri ricerca
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
  attivo?: string | null; // "includi disattivati" (solo ADM)
}

// DETTAGLIO -> GET /api/impianti/{id} (ImpiantoResponseDTO)
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
  regione: CodiceDescrizioneBase;
  provincia: CodiceDescrizioneBase;
  comune: CodiceDescrizioneBase;
  indirizzo: CodiceDescrizioneBase;
  civico: CodiceDescrizioneBase;
  cap: CodiceDescrizioneBase;
  statoImpianto: string;
  attivo: string;
}

// CREATE/EDIT -> ImpiantoRequestDTO / UpdateImpiantoDTO
export interface ImpiantoRequest extends Omit<ImpiantoDettaglio, 'idImpianto'> {
  // emailUtenteLoggato aggiunto in automatico da ApiService.post/put
}
