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
  provincia : string;
  comune : CodiceDescrizioneBase;
  indirizzo : string;
  civico : string;
  cap : string;
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
  provincia! : string ;
  comune! : CodiceDescrizioneBase ;
  indirizzo! : string ;
  civico! : string ;
  cap! : string ;
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
  idCer: number;
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
  idCer! : number;
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


export interface ImpiantoSearchFilter{
  idImpianto : number;
  idConfigurazione : number ;
  idCer : number ;
  codiceCabina : string ;
  tipologiaImpianto : string ;
  statoImpianto : string ;
  regione : string ;
  provincia : string ;
  comune : string ;
  potenzaNominaleKw : number ;
  presenzaAccumulo : string ;
  attivo : string ;
}

export class ImpiantoSearchFilterModel implements ImpiantoSearchFilter{
  idImpianto! : number ;
  idConfigurazione! : number ;
  idCer! : number ;
  codiceCabina! : string ;
  tipologiaImpianto! : string ;
  statoImpianto! : string ;
  regione! : string ;
  provincia! : string ;
  comune! : string ;
  potenzaNominaleKw! : number ;
  presenzaAccumulo! : string ;
  attivo! : string ;  
  
  constructor(init?: Partial<ImpiantoSearchFilter>) {
    Object.assign(this,init);
  } 
}

export interface ImpiantoById{
  idImpianto : number;
  idConfigurazione : number;
  flagEsercizio : string;
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
  regione : string;
  provincia : string;
  comune : string;
  indirizzo : string;
  civico : string;
  cap : string;
  statoImpianto : string;
  attivo : string;
  specTipologia : string;
  specCatProduttore : string;
  tipologiaSitoInst : string;
  specSitoInst : string;
}

export class ImpiantoByIdModel implements ImpiantoById{
  idImpianto! : number;
  idConfigurazione! : number;
  flagEsercizio! : string;
  dataEntrataEsercizio! : Date;
  tipologiaImpianto! : string;
  potenzaNominaleKw! : number;
  presenzaAccumulo! : string;
  capacitaAccumuloKwh! : number;
  categoriaProduttore! : string;
  codiceCategoriaProduttore! : string;
  specificaTipologiaImpianto! : string;
  specificaCategoriaProduttore! : string;
  tipologiaSitoInstallazione! : string;
  specificaSitoInstallazione! : string  ;
  regione! : string;
  provincia! : string;
  comune! : string ;
  indirizzo! : string;
  civico! : string;
  cap! : string;
  statoImpianto! : string;
  attivo! : string;
  specTipologia! : string;
  specCatProduttore! : string;
  tipologiaSitoInst! : string ;
  specSitoInst! : string; 

  constructor(init?: Partial<ImpiantoById>) { 
    Object.assign(this,init);
  }
}

export interface ImpiantoEdit {

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
  indirizzo: string;
  civico: string;
  cap: string;
  statoImpianto: string;
  attivo: string;
  specTipologia: string;
  specCatProduttore: string;
  tipologiaSitoInst: string;
  specSitoInst: string;
  emailUtenteLoggato: string;
}

export class ImpiantoEditModel implements ImpiantoEdit {

  idConfigurazione!: number;
  flagEsercizio!: string;
  dataEntrataEsercizio!: string;
  tipologiaImpianto!: string;
  potenzaNominaleKw!: number;
  presenzaAccumulo!: string;
  capacitaAccumuloKwh!: number;
  categoriaProduttore!: string;
  codiceCategoriaProduttore!: string;
  specificaTipologiaImpianto!: string;
  specificaCategoriaProduttore!: string;
  tipologiaSitoInstallazione!: string;
  specificaSitoInstallazione!: string;
  regione!: CodiceDescrizioneBase;
  provincia!: CodiceDescrizioneBase;
  comune!: CodiceDescrizioneBase;
  indirizzo!: string;
  civico!: string;
  cap!: string;
  statoImpianto!: string;
  attivo!: string;
  specTipologia!: string;
  specCatProduttore!: string;
  tipologiaSitoInst!: string;
  specSitoInst!: string;
  emailUtenteLoggato!: string;  

  constructor(init?: Partial<ImpiantoEdit>) {
    Object.assign(this,init);
  }

}


