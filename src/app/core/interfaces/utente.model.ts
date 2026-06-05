

export interface Utente {
  id_utente: number | null;
  nome?: string | null;
  cognome?: string | null;
  codiceFiscale: string | null;
  mail?: string | null;
  password: string | null;
  numTelefono?: string | null;
}

export class UtenteModel implements Utente {
  id_utente: number | null;
  nome?: string | null;
  cognome?: string | null;
  codiceFiscale: string | null;
  mail?: string | null;
  password: string | null;
  numTelefono?: string | null;

  constructor(data?: Partial<Utente>) {
    this.id_utente = data?.id_utente ?? null;
    this.nome = data?.nome ?? null;
    this.cognome = data?.cognome ?? null;
    this.codiceFiscale = data?.codiceFiscale ?? null;
    this.mail = data?.mail ?? null;
    this.password = data?.password ?? null;
    this.numTelefono = data?.numTelefono ?? null;
  }
}

export interface UtenteLogin {
  email?: string | null;
  password?: string | null;
}

export class UtenteLoginModel implements UtenteLogin {
  email?: string | null;
  password?: string | null;

  constructor(data?: Partial<UtenteLogin>) {
    this.email = data?.email ?? null;
    this.password = data?.password ?? null;
  }
}
