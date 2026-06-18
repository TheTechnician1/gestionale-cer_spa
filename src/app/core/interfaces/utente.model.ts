import Decimal from 'decimal.js';

export interface Utente {
  id: number | null;
  nome?: string | null;
  cognome?: string | null;
  email?: string | null;
  password: string | null;
  saldo: Decimal | null;
}

export class UtenteModel implements Utente {
  id: number | null;
  nome?: string | null;
  cognome?: string | null;
  email?: string | null;
  password: string | null;
  saldo: Decimal | null;

  constructor(data?: Partial<Utente>) {
    this.id = data?.id ?? null;
    this.nome = data?.nome ?? null;
    this.cognome = data?.cognome ?? null;
    this.email = data?.email ?? null;
    this.password = data?.password ?? null;
    this.saldo = data?.saldo ?? null;
  }
}

export interface UtenteLogin {
  nome?: string | null;
  cognome?: string | null;
  email?: string | null;
  password?: string | null;
  saldo: Decimal | null;
}

export class UtenteLoginModel implements UtenteLogin {
  nome?: string | null;
  cognome?: string | null;
  email?: string | null;
  password?: string | null;
  saldo: Decimal | null;

  constructor(data?: Partial<UtenteLogin>) {
    this.nome = data?.nome ?? null;
    this.cognome = data?.cognome ?? null;
    this.email = data?.email ?? null;
    this.password = data?.password ?? null;
    this.saldo = data?.saldo ?? null;
  }
}
