export interface Utente {
  id_utente: string | null;
  nome_utente?: string | null;
  cognome_utente?: string | null;
  codice_fiscale: string | null;
  mail?: string | null;
  num_telefono?: string | null;
  ruolo: string | null;
  flg_cancellato: string | null;
  utente_upd?: string | null;
  data_inserimento: string | null;
  data_modifica: string | null;
}

export class UtenteModel implements Utente {
  id_utente: string | null;
  nome_utente?: string | null;
  cognome_utente?: string | null;
  codice_fiscale: string | null;
  mail?: string | null;
  num_telefono?: string | null;
  ruolo: string | null;
  flg_cancellato: string | null;
  utente_upd?: string | null;
  data_inserimento: string | null;
  data_modifica: string | null;

  constructor(data?: Partial<Utente>) {
    this.id_utente = data?.id_utente ?? null;
    this.nome_utente = data?.nome_utente ?? null;
    this.cognome_utente = data?.cognome_utente ?? null;
    this.codice_fiscale = data?.codice_fiscale ?? null;
    this.mail = data?.mail ?? null;
    this.num_telefono = data?.num_telefono ?? null;
    this.ruolo = data?.ruolo ?? null;
    this.flg_cancellato = data?.flg_cancellato ?? "N";
    this.utente_upd = data?.utente_upd ?? null;
    this.data_inserimento = data?.data_inserimento ?? null;
    this.data_modifica = data?.data_modifica ?? null;
  }
}
