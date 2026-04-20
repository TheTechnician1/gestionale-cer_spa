export interface Impianto {
  id_impianto: string | null,
  id_configurazione: string | null,
  codice_cabina: string | null,
  flag_impianto: boolean | null,
  data_entrata_esercizio: string | null,
  tipologia_impianto: string | null,
  potenza_nominale: string | null,
  presenza_accumulo: string | null,
  capacita_accumulo: string | null,
  tipologia_produttore: string | null,
  categoria_produttore: string | null,
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
  id_impianto: string | null;
  id_configurazione: string | null;
  codice_cabina: string | null;
  flag_impianto: boolean | null;
  data_entrata_esercizio: string | null;
  tipologia_impianto: string | null;
  potenza_nominale: string | null;
  presenza_accumulo: string | null;
  capacita_accumulo: string | null;
  tipologia_produttore: string | null;
  categoria_produttore: string | null;
  ubicazione_impianto: UbicazioneImpianto[] | null;

  constructor(data?: Partial<Impianto>) {
    this.id_impianto = data?.id_impianto ?? null;
    this.id_configurazione = data?.id_configurazione ?? null;
    this.codice_cabina = data?.codice_cabina ?? null;
    this.flag_impianto = data?.flag_impianto ?? null;
    this.data_entrata_esercizio = data?.data_entrata_esercizio ?? null;
    this.tipologia_impianto = data?.tipologia_impianto ?? null;
    this.potenza_nominale = data?.potenza_nominale ?? null;
    this.presenza_accumulo = data?.presenza_accumulo ?? null;
    this.capacita_accumulo = data?.capacita_accumulo ?? null;
    this.tipologia_produttore = data?.tipologia_produttore ?? null;
    this.categoria_produttore = data?.categoria_produttore ?? null;
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
