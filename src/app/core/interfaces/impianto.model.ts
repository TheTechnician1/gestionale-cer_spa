export interface Impianto {
  idImpianto: number | null,
  idConfigurazione: number | null,
  flgEsercizio: string | null,
  dataEserc: Date | null,
  partitaIva: string | null,
  regione: string | null,
  comune: string | null,
  provincia: string | null,
  codiceCabina: string | null,
  codiceTipologia: string | null,
  codTipologia: CodiceTipologia | null,
  preNom: number | null,
  flgAccumulo: string | null,
  capAccumulo: number | null,
  tipoProduttore: string | null,
  codCategoriaProduttore: string | null,
  codCatProd: CategoriaProduttore | null,
  codInstallazione: string | null,
  flg_cancellazione: string | null,
  speCTipologia: string | null,
  spec_cat_produttore: string | null,
  cod_sito_inst: string | null,
  speSitoInst: string | null,
  ubicazione: UbicazioneImpianto[] | null,
  specCatProduttore: string | null,
  codSitoInst: string | null,
  emailUtenteLoggato: string | null
}

export interface CodiceTipologia {
  codTipologia: string | null,
  descrizione: string | null
}

export interface CategoriaProduttore {
  cod_prod: string | null,
  descrizione: string | null
}

export interface UbicazioneImpianto {
  idImpianto: number | null,
  regione: string | null,
  comune: string | null,
  indirizzo: string | null,
  cap: string | null,
  codTipoInst: TipologiaInstallazione | null,
  specTipoInst: string | null
}

export interface TipologiaInstallazione {
  codInst: string | null,
  descrizione: string | null
}

export class ImpiantoModel implements Impianto {
  idImpianto: number | null;
  idConfigurazione: number | null;
  flgEsercizio: string | null;
  dataEserc: Date | null;
  partitaIva: string | null;
  regione: string | null;
  comune: string | null;
  provincia: string | null;
  codiceCabina: string | null;
  codiceTipologia: string | null;
  codTipologia: CodiceTipologia | null;
  preNom: number | null;
  flgAccumulo: string | null;
  capAccumulo: number | null;
  tipoProduttore: string | null;
  codCategoriaProduttore: string | null;
  codCatProd: CategoriaProduttore | null;
  codInstallazione: string | null;
  flg_cancellazione: string | null;
  speCTipologia: string | null;
  spec_cat_produttore: string | null;
  cod_sito_inst: string | null;
  speSitoInst: string | null;
  ubicazione: UbicazioneImpianto[] | null;
  specCatProduttore: string | null;
  codSitoInst: string | null;
  emailUtenteLoggato: string | null;

  constructor(data?: Partial<Impianto>) {
    this.idImpianto = data?.idImpianto ?? null;
    this.idConfigurazione = data?.idConfigurazione ?? null;
    this.flgEsercizio = data?.flgEsercizio ?? null;
    this.dataEserc = data?.dataEserc ?? null;
    this.partitaIva = data?.partitaIva ?? null;
    this.codiceTipologia = data?.codiceTipologia ?? null;
    this.codTipologia = data?.codTipologia ?? null;
    this.regione = data?.regione ?? null;
    this.comune = data?.comune ?? null;
    this.provincia = data?.provincia ?? null;
    this.codiceCabina = data?.codiceCabina ?? null;
    this.preNom = data?.preNom ?? null;
    this.flgAccumulo = data?.flgAccumulo ?? null;
    this.capAccumulo = data?.capAccumulo ?? null;
    this.tipoProduttore = data?.tipoProduttore ?? null;
    this.codCategoriaProduttore = data?.codCategoriaProduttore ?? null;
    this.codCatProd = data?.codCatProd ?? null;
    this.codInstallazione = data?.codInstallazione ?? null;
    this.flg_cancellazione = data?.flg_cancellazione ?? null;
    this.speCTipologia = data?.speCTipologia ?? null;
    this.spec_cat_produttore = data?.spec_cat_produttore ?? null;
    this.cod_sito_inst = data?.cod_sito_inst ?? null;
    this.speSitoInst = data?.speSitoInst ?? null;
    this.ubicazione = data?.ubicazione ?? null;
    this.specCatProduttore = data?.specCatProduttore ?? null;
    this.codSitoInst = data?.codSitoInst ?? null;
    this.emailUtenteLoggato = data?.emailUtenteLoggato ?? null;
  }
}

export class CodiceTipologiaModel implements CodiceTipologia {
  codTipologia: string | null;
  descrizione: string | null;

  constructor(data?: Partial<CodiceTipologia>) {
    this.codTipologia = data?.codTipologia ?? null;
    this.descrizione = data?.descrizione ?? null;
  }
}

export class CategoriaProduttoreModel implements CategoriaProduttore {
  cod_prod: string | null;
  descrizione: string | null;

  constructor(data?: Partial<CategoriaProduttore>) {
    this.cod_prod = data?.cod_prod ?? null;
    this.descrizione = data?.descrizione ?? null;
  }
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
    this.codTipoInst = data?.codTipoInst ?? null;
    this.specTipoInst = data?.specTipoInst ?? null;
  }
}

export class TipologiaInstallazioneModel implements TipologiaInstallazione {
  codInst: string | null;
  descrizione: string | null;

  constructor(data?: Partial<TipologiaInstallazione>) {
    this.codInst = data?.codInst ?? null;
    this.descrizione = data?.descrizione ?? null;
  }
}
