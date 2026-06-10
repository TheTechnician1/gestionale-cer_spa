import { RoleType } from "../enum/role.enum";

export interface Utente {
  id: number | null;
  nome?: string | null;
  cognome?: string | null;
  email?: string | null;
  pwd: string | null;
}

export class UtenteModel implements Utente {
  id: number | null;
  nome?: string | null;
  cognome?: string | null;
  email?: string | null;
  pwd: string | null;

  constructor(data?: Partial<Utente>) {
    this.id = data?.id ?? null;
    this.nome = data?.nome ?? null;
    this.cognome = data?.cognome ?? null;
    this.email = data?.email ?? null;
    this.pwd = data?.pwd ?? null;
  }
}

export interface UtenteLogin {
  id: number | null;
  nome?: string | null;
  cognome?: string | null;
  email?: string | null;
  pwd: string | null;
}

export class UtenteLoginModel implements UtenteLogin {
  id: number | null;
  nome?: string | null;
  cognome?: string | null;
  email?: string | null;
  pwd: string | null;

  constructor(data?: Partial<UtenteLogin>) {
    this.id = data?.id ?? null;
    this.nome = data?.nome ?? null;
    this.cognome = data?.cognome ?? null;
    this.email = data?.email ?? null;
    this.pwd = data?.pwd ?? null;
  }
}
