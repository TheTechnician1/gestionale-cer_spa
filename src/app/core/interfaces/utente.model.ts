import { RoleType } from "../enum/role.enum";

export interface Utente {
  id_utente: number | null;
  nome?: string | null;
  cognome?: string | null;
  codiceFiscale: string | null;
  mail?: string | null;
  password: string | null;
  numTelefono?: string | null;
  ruolo: RoleType | null;
}

export class UtenteModel implements Utente {
  id_utente: number | null;
  nome?: string | null;
  cognome?: string | null;
  codiceFiscale: string | null;
  mail?: string | null;
  password: string | null;
  numTelefono?: string | null;
  ruolo: RoleType | null;

  constructor(data?: Partial<Utente>) {
    this.id_utente = data?.id_utente ?? null;
    this.nome = data?.nome ?? null;
    this.cognome = data?.cognome ?? null;
    this.codiceFiscale = data?.codiceFiscale ?? null;
    this.mail = data?.mail ?? null;
    this.password = data?.password ?? null;
    this.numTelefono = data?.numTelefono ?? null;
    this.ruolo = data?.ruolo ?? null;
  }
}

export interface UtenteLogin {
  idUtente: number | null;
  nomeUtente?: string | null;
  cognomeUtente?: string | null;
  codiceFiscale: string | null;
  mail?: string | null;
  numeroTelefono?: string | null;
  ruolo: RoleType | null;
  flagCancellato: string | null;
  utenteUpd?: string | null;
  dataInserimento: string | null;
  dataModifica: string | null;
}

export class UtenteLoginModel implements UtenteLogin {
  idUtente: number | null;
  nomeUtente?: string | null;
  cognomeUtente?: string | null;
  codiceFiscale: string | null;
  mail?: string | null;
  numeroTelefono?: string | null;
  ruolo: RoleType | null;
  flagCancellato: string | null;
  utenteUpd?: string | null;
  dataInserimento: string | null;
  dataModifica: string | null;

  constructor(data?: Partial<UtenteLogin>) {
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
