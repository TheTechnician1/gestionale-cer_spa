export interface Impianto {
  id_impianto: string | null;
  id_configurazione: string | null;
  flg_esercizio: string | null; // S/N
  data_eserc: string | null;
  cod_tipologia: string | null;
  pre_nom: string | null;
  flg_accumulo: string | null;
  cap_accumulo: string | null;
  tipo_produttore: string | null;
  cod_cat_prod: string | null;
  flg_cancellazione?: string | null; // S= cancellata, N= attiva
}

export class ImpiantoModel implements Impianto {
  id_impianto: string | null;
  id_configurazione: string | null;
  flg_esercizio: string | null;
  data_eserc: string | null;
  cod_tipologia: string | null;
  pre_nom: string | null;
  flg_accumulo: string | null;
  cap_accumulo: string | null;
  tipo_produttore: string | null;
  cod_cat_prod: string | null;
  flg_cancellazione?: string | null;

  constructor(data?: Partial<Impianto>) {
    this.id_impianto = data?.id_impianto ?? null;
    this.id_configurazione = data?.id_configurazione ?? null;
    this.flg_esercizio = data?.flg_esercizio ?? null;
    this.data_eserc = data?.data_eserc ?? null;
    this.cod_tipologia = data?.cod_tipologia ?? null;
    this.pre_nom = data?.pre_nom ?? null;
    this.flg_accumulo = data?.flg_accumulo ?? null;
    this.cap_accumulo = data?.cap_accumulo ?? null;
    this.tipo_produttore = data?.tipo_produttore ?? null;
    this.cod_cat_prod = data?.cod_cat_prod ?? null;
    this.flg_cancellazione = data?.flg_cancellazione ?? null;
  }
}
