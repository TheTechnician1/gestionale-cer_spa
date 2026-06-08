export interface Utente {
  id: number | null;
  name?: string | null;
  surname?: string | null;
  email?: string | null;
  password: string | null;
  balance?: number | null;
}

export class UtenteModel implements Utente {
  id: number | null;
  name?: string | null;
  surname?: string | null;
  email?: string | null;
  password: string | null;
  balance?: number | null;

  constructor(data?: Partial<Utente>) {
    this.id = data?.id ?? null;
    this.name = data?.name ?? null;
    this.surname = data?.surname ?? null;
    this.email = data?.email ?? null;
    this.password = data?.password ?? null;
    this.balance = data?.balance ?? null;
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
