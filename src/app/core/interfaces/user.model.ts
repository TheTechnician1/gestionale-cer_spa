export interface Utente {
  messaggio?: string | null;
  ruolo: string | null;
}

export class UtenteModel implements Utente {
  messaggio?: string | null;
  ruolo: string | null;

  constructor(data?: Partial<Utente>) {
    this.ruolo = data?.ruolo ?? null;
    this.messaggio = data?.messaggio ?? null;
  }
}

export interface RegistrazioneUtente {
  idUtente: number | null;
  nomeUtente: string | null;
  cognomeUtente: string | null;
  codiceFiscale: string | null;
  mail: string | null;
  telefono: number | null;
  ruolo: string | null;
  flagCanc: string | null;
  password: string | null;
}
