export interface Autenticazione {
  utente: string | null;
  password: string | null;
}

export class AutenticazioneModel implements Autenticazione {
  utente: string | null;
  password: string | null;

  constructor(data?: Partial<Autenticazione>) {
    this.utente = data?.utente ?? null;
    this.password = data?.password ?? null;
  }
}
