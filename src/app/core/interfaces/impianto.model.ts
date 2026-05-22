export interface Impianto {
  
  idConfigurazione :  number;
  flagEsercizio : string ;
  dataEntrataEsercizio : Date;
  tipologiaImpianto : string;
  potenzaNominaleKw : number;
  presenzaAccumulo : string;
  capacitaAccumuloKwh : number;
  categoriaProduttore : string;
  codiceCategoriaProduttore : string;
  specificaTipologiaImpianto : string;
  specificaCategoriaProduttore : string;
  tipologiaSitoInstallazione : string;
  specificaSitoInstallazione : string;
  regione : CodiceDescrizioneBase;
  provincia : CodiceDescrizioneBase;
  comune : CodiceDescrizioneBase;
  indirizzo : CodiceDescrizioneBase;
  civico : CodiceDescrizioneBase;
  cap : CodiceDescrizioneBase;
  statoImpianto : string;
  attivo : string;
  emailUtenteLoggato : string;
}

export class ImpiantoModel implements Impianto {

  idConfigurazione! :  number;
  flagEsercizio! : string ;
  dataEntrataEsercizio! : Date 
  tipologiaImpianto! : string ;
  potenzaNominaleKw! : number ;
  presenzaAccumulo! : string ;
  capacitaAccumuloKwh! : number ;
  categoriaProduttore! : string ;
  codiceCategoriaProduttore! : string ;
  specificaTipologiaImpianto! : string;
  specificaCategoriaProduttore! : string;
  tipologiaSitoInstallazione! : string;
  specificaSitoInstallazione! : string;
  regione! : CodiceDescrizioneBase ;
  provincia! : CodiceDescrizioneBase ;
  comune! : CodiceDescrizioneBase ;
  indirizzo! : CodiceDescrizioneBase ;
  civico! : CodiceDescrizioneBase ;
  cap! : CodiceDescrizioneBase ;
  statoImpianto! : string ;
  attivo! : string ;
  emailUtenteLoggato! : string ;

  constructor(init?: Partial<Impianto>) {
    Object.assign(this,init);
  }
}

export interface CodiceDescrizioneBase {

  codice: string;
  descrizione: string;
  specifica: string;
}

export class CodiceDescrizioneBaseModel implements CodiceDescrizioneBase {

  codice!: string;
  descrizione!: string;
  specifica!: string;

  constructor(init?: Partial<CodiceDescrizioneBase>) {
    Object.assign(this,init);
  }
}

export interface ImpiantoView{

  idImpianto : number;
  idConfigurazione : number;
  codiceCabina : string;
  tipologiaImpianto : string;
  statoImpianto : string;
  regione : string;
  provincia : string;
  comune : string;
  potenzaNominaleKw : number;
  presenzaAccumulo : string;
  attivo : string;
}

export class ImpiantoViewModel implements ImpiantoView{

  idImpianto! : number;
  idConfigurazione! : number;
  codiceCabina! : string;
  tipologiaImpianto! : string;
  statoImpianto! : string;
  regione! : string;
  provincia! : string;
  comune! : string;
  potenzaNominaleKw! : number;
  presenzaAccumulo! : string;
  attivo! : string;

  constructor(init?: Partial<CodiceDescrizioneBase>) {
    Object.assign(this,init);
  }
}

