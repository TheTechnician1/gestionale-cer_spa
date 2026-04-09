export interface Impianto {
    id_impianto: string,
    id_configurazione: string,
    codice_cabina: string,
    flag_impianto: boolean,
    data_entrata_esercizio: string,
    tipologia_impianto: string,
    potenza_nominale: string,
    presenza_accumulo: string,
    capacita_accumulo: string,
    tipologia_produttore: string,
    categoria_produttore: string,
    ubicazione_impianto: [
      {
      regione: string,
      provincia: string,
      comune: string,
      indirizzo: string,
      numero_civico: string,
      cap: string,
      tipologia_sito: string
    }
  ];
}
