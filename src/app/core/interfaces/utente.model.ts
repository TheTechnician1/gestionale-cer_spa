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

// Risposta del login (POST /api/auth/login -> UtenteEntity).
export interface UtenteLogin {
  idUtente: number | null;
  nome?: string | null;
  cognome?: string | null;
  codiceFiscale: string | null;
  mail?: string | null;
  numTelefono?: string | null;
  ruolo: RoleType | null;
}

export class UtenteLoginModel implements UtenteLogin {
  idUtente: number | null;
  nome?: string | null;
  cognome?: string | null;
  codiceFiscale: string | null;
  mail?: string | null;
  numTelefono?: string | null;
  ruolo: RoleType | null;

  constructor(data?: Partial<UtenteLogin>) {
    this.idUtente = data?.idUtente ?? null;
    this.nome = data?.nome ?? null;
    this.cognome = data?.cognome ?? null;
    this.codiceFiscale = data?.codiceFiscale ?? null;
    this.mail = data?.mail ?? null;
    this.numTelefono = data?.numTelefono ?? null;
    this.ruolo = data?.ruolo ?? null;
  }
}
