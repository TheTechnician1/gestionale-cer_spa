import { StatoImpianto } from "src/app/core/enum/stato-impianto.enum";

export interface Impianto {
  idImpianto: number | null;
  idCer: number | null;
  idConfigurazione: number | null;
  codiceCabina: string | null;
  flgEsercizio: string | null;
  annoAttivazione: Date | null;
  tipologia: string | null;
  potenzaNominale: number | null;
  flgAccumulo: string | null;
  capAccumulo: number | null;
  tipologiaProduttore: string | null;
  regione: string | null;
  provincia: string | null;
  comune: string | null;
  indirizzo: string | null;
  civico: string | null;
  cap: string | null;
  statoImpianto: StatoImpianto | null;
  flg_cancellazione: string | null;
  emailUtenteLoggato: string | null;
  dataUltimaModifica: Date | null;
  utenteUltimaModifica: string | null;
}

export class ImpiantoModel implements Impianto {
  idImpianto: number | null;
  idCer: number | null;
  idConfigurazione: number | null;
  codiceCabina: string | null;
  flgEsercizio: string | null;
  annoAttivazione: Date | null;
  tipologia: string | null;
  potenzaNominale: number | null;
  flgAccumulo: string | null;
  capAccumulo: number | null;
  tipologiaProduttore: string | null;
  regione: string | null;
  provincia: string | null;
  comune: string | null;
  indirizzo: string | null;
  civico: string | null;
  cap: string | null;
  statoImpianto: StatoImpianto | null;
  flg_cancellazione: string | null;
  emailUtenteLoggato: string | null;
  dataUltimaModifica: Date | null;
  utenteUltimaModifica: string | null;

  constructor(data?: Partial<Impianto>) {
    this.idImpianto = data?.idImpianto ?? null;
    this.idCer = data?.idCer ?? null;
    this.idConfigurazione = data?.idConfigurazione ?? null;
    this.codiceCabina = data?.codiceCabina ?? null;
    this.flgEsercizio = data?.flgEsercizio ?? null;
    this.annoAttivazione = data?.annoAttivazione ?? null;
    this.tipologia = data?.tipologia ?? null;
    this.potenzaNominale = data?.potenzaNominale ?? null;
    this.flgAccumulo = data?.flgAccumulo ?? null;
    this.capAccumulo = data?.capAccumulo ?? null;
    this.tipologiaProduttore = data?.tipologiaProduttore ?? null;
    this.regione = data?.regione ?? null;
    this.provincia = data?.provincia ?? null;
    this.comune = data?.comune ?? null;
    this.indirizzo = data?.indirizzo ?? null;
    this.civico = data?.civico ?? null;
    this.cap = data?.cap ?? null;
    this.statoImpianto = data?.statoImpianto ?? null;
    this.flg_cancellazione = data?.flg_cancellazione ?? null;
    this.emailUtenteLoggato = data?.emailUtenteLoggato ?? null;
    this.dataUltimaModifica = data?.dataUltimaModifica ?? null;
    this.utenteUltimaModifica = data?.utenteUltimaModifica ?? null;
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
