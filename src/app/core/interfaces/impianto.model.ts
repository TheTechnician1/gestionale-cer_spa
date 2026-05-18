export interface Impianto {
  idImpianto : number |null;
  idConfigurazione : number  |null;
  flgEsercizio : string |null;
  dataEserc : Date  |null;
  codTipologia : string |null;
  potenzaNominaleKw : number |null;
  flgAccumulo : string |null;
  capAccumulo :  number |null;
  tipoProduttore : string |null;
  codCatProd : string  |null;
  flgCancellazione : string |null;
  specTipologia : string |null;
  specCatProduttore : string |null;
  codSitoInst : string |null;
  specSitoInst : string  |null;
  statoImpianto :  string |null;
}

export class ImpiantoModel implements Impianto {
  idImpianto : number |null;
  idConfigurazione : number  |null;
  flgEsercizio : string |null;
  dataEserc : Date  |null;
  codTipologia : string |null;
  potenzaNominaleKw : number |null;
  flgAccumulo : string |null;
  capAccumulo :  number |null;
  tipoProduttore : string |null;
  codCatProd : string  |null;
  flgCancellazione : string |null;
  specTipologia : string |null;
  specCatProduttore : string |null;
  codSitoInst : string |null;
  specSitoInst : string  |null;
  statoImpianto :  string |null;

  constructor(data?: Partial<Impianto>) {
    this.idImpianto = data?.idImpianto ?? null;
    this.idConfigurazione = data?.idConfigurazione ?? null;
    this.flgEsercizio = data?.flgEsercizio ?? null;
    this.dataEserc = data?.dataEserc ?? null;
    this.codTipologia = data?.codTipologia ?? null;
    this.potenzaNominaleKw = data?.potenzaNominaleKw ?? null;
    this.flgAccumulo = data?.flgAccumulo ?? null;
    this.capAccumulo =  data?.capAccumulo ?? null;
    this.tipoProduttore = data?.tipoProduttore ?? null;
    this.codCatProd = data?.codCatProd ?? null;
    this.flgCancellazione = data?.flgCancellazione ?? null;
    this.specTipologia = data?.specTipologia ?? null;
    this.specCatProduttore = data?.specCatProduttore ?? null;
    this.codSitoInst = data?.codSitoInst ?? null;
    this.specSitoInst = data?.specSitoInst ?? null;
    this.statoImpianto =  data?.statoImpianto ?? null;
  }
}

export interface CodiceTipologia {
  codTipologia: string | null;
  descrizione: string | null;
}

export class CodiceTipologiaModel implements CodiceTipologia {
  codTipologia: string | null;
  descrizione: string | null;

  constructor(data?: Partial<CodiceTipologia>) {
    this.codTipologia = data?.codTipologia ?? null;
    this.descrizione = data?.descrizione ?? null;
  }
}

export interface CategoriaProduttore {
  cod_prod: string | null;
  descrizione: string | null;
}

export class CategoriaProduttoreModel implements CategoriaProduttore {
  cod_prod: string | null;
  descrizione: string | null;

  constructor(data?: Partial<CategoriaProduttore>) {
    this.cod_prod = data?.cod_prod ?? null;
    this.descrizione = data?.descrizione ?? null;
  }
}

export interface UbicazioneImpianto {
  idImpianto: number | null;
  regione: string | null;
  comune: string | null;
  indirizzo: string | null;
  cap: string | null;
  codTipoInst: TipologiaInstallazione | null;
  specTipoInst: string | null;
}

export class UbicazioneImpiantoModel implements UbicazioneImpianto {
  idImpianto: number | null;
  regione: string | null;
  comune: string | null;
  indirizzo: string | null;
  cap: string | null;
  codTipoInst: TipologiaInstallazione | null;
  specTipoInst: string | null;

  constructor(data?: Partial<UbicazioneImpianto>) {
    this.idImpianto = data?.idImpianto ?? null;
    this.regione = data?.regione ?? null;
    this.comune = data?.comune ?? null;
    this.indirizzo = data?.indirizzo ?? null;
    this.cap = data?.cap ?? null;
    this.codTipoInst = data?.codTipoInst ? new TipologiaInstallazioneModel(data.codTipoInst) : null;
    this.specTipoInst = data?.specTipoInst ?? null;
  }
}

export interface TipologiaInstallazione {
  codInst: string | null;
  descrizione: string | null;
}

export class TipologiaInstallazioneModel implements TipologiaInstallazione {
  codInst: string | null;
  descrizione: string | null;

  constructor(data?: Partial<TipologiaInstallazione>) {
    this.codInst = data?.codInst ?? null;
    this.descrizione = data?.descrizione ?? null;
  }
}
