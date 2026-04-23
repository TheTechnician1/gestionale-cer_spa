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

export interface AnagraficaCER {
  ragioneSociale: string;
  p_iva: number;
  formaGiuridica: string;
  stato: string;
  azioni: any;
}

export interface AnagraficaUtenti{
  nome: string;
  cognome: string;
  email: string;
  ruolo: string;
  azioni: any;
}

export interface GetListaCER{
  idCer?: number,
  ragioneSociale: string,
  codiceFiscale: string,
  partitaIVA: string,
  comuneSedeLegale: string,
  provinciaSedeLegale: string,
  regioneLegale: string,
  formaGiuridica: string,
  telefono: number,
  email: string,
  pec: string,
  sitoWeb: string,
  referente: string,
  flgCanc?: string,
  specFormaGiuridica?: string
}


