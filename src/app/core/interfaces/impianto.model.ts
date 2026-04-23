export interface Impianto {
  idImpianto: number | null,
  idConfigurazione: number | null,
  flgEsercizio: string | null,
  dataEserc: Date | null,
  codTipologia: string | null,
  preNom: number | null,
  flgAccumulo: string | null,
  capAccumulo: number | null,
  tipoProduttore: string | null,
  codCatProd: string | null,
  flg_cancellazione: string | null,
  spec_tipologia: string | null,
  spec_cat_produttore: string | null,
  cod_sito_inst: string | null,
  speSitoInst: string | null,
  ubicazione_impianto: UbicazioneImpianto[] | null
}

export interface UbicazioneImpianto {
  regione: string | null,
  provincia: string | null,
  comune: string | null,
  indirizzo: string | null,
  numero_civico: string | null,
  cap: string | null,
  tipologia_sito: string | null
}

export class ImpiantoModel implements Impianto {
  idImpianto: number | null;
  idConfigurazione: number | null;
  flgEsercizio: string | null;
  dataEserc: Date | null;
  codTipologia: string | null;
  preNom: number | null;
  flgAccumulo: string | null;
  capAccumulo: number | null;
  tipoProduttore: string | null;
  codCatProd: string | null;
  flg_cancellazione: string | null;
  spec_tipologia: string | null;
  spec_cat_produttore: string | null;
  cod_sito_inst: string | null;
  speSitoInst: string | null;
  ubicazione_impianto: UbicazioneImpianto[] | null;

  constructor(data?: Partial<Impianto>) {
    this.idImpianto = data?.idImpianto ?? null;
    this.idConfigurazione = data?.idConfigurazione ?? null;
    this.flgEsercizio = data?.flgEsercizio ?? null;
    this.dataEserc = data?.dataEserc ?? null;
    this.codTipologia = data?.codTipologia ?? null;
    this.preNom = data?.preNom ?? null;
    this.flgAccumulo = data?.flgAccumulo ?? null;
    this.capAccumulo = data?.capAccumulo ?? null;
    this.tipoProduttore = data?.tipoProduttore ?? null;
    this.codCatProd = data?.codCatProd ?? null;
    this.flg_cancellazione = data?.flg_cancellazione ?? null;
    this.spec_tipologia = data?.spec_tipologia ?? null;
    this.spec_cat_produttore = data?.spec_cat_produttore ?? null;
    this.cod_sito_inst = data?.cod_sito_inst ?? null;
    this.speSitoInst = data?.speSitoInst ?? null;
    this.ubicazione_impianto = data?.ubicazione_impianto ?? null;
  }
}

export class UbicazioneImpiantoModel implements UbicazioneImpianto {
  regione: string | null;
  provincia: string | null;
  comune: string | null;
  indirizzo: string | null;
  numero_civico: string | null;
  cap: string | null;
  tipologia_sito: string | null;

  constructor(data?: Partial<UbicazioneImpianto>) {
    this.regione = data?.regione ?? null;
    this.provincia = data?.provincia ?? null;
    this.comune = data?.comune ?? null;
    this.indirizzo = data?.indirizzo ?? null;
    this.numero_civico = data?.numero_civico ?? null;
    this.cap = data?.cap ?? null;
    this.tipologia_sito = data?.tipologia_sito ?? null;
  }
}
