export interface Utente {
  idUtente: string | null;
  nomeUtente?: string | null;
  cognomeUtente?: string | null;
  codiceFiscale: string | null;
  mail?: string | null;
  numeroTelefono?: string | null;
  ruolo: string | null;
  flagCancellato: string | null;
  utenteUpd?: string | null;
  dataInserimento: string | null;
  dataModifica: string | null;
}

export class UtenteModel implements Utente {
  idUtente: string | null;
  nomeUtente?: string | null;
  cognomeUtente?: string | null;
  codiceFiscale: string | null;
  mail?: string | null;
  numeroTelefono?: string | null;
  ruolo: string | null;
  flagCancellato: string | null;
  utenteUpd?: string | null;
  dataInserimento: string | null;
  dataModifica: string | null;

  constructor(data?: Partial<Utente>) {
    this.idUtente = data?.idUtente ?? null;
    this.nomeUtente = data?.nomeUtente ?? null;
    this.cognomeUtente = data?.cognomeUtente ?? null;
    this.codiceFiscale = data?.codiceFiscale ?? null;
    this.mail = data?.mail ?? null;
    this.numeroTelefono = data?.numeroTelefono ?? null;
    this.ruolo = data?.ruolo ?? null;
    this.flagCancellato = data?.flagCancellato ?? "N";
    this.utenteUpd = data?.utenteUpd ?? null;
    this.dataInserimento = data?.dataInserimento ?? null;
    this.dataModifica = data?.dataModifica ?? null;
  }
}
