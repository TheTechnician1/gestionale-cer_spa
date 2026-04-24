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
 partitaIVA: string,
 
}

export class GetListaCERModel implements GetListaCER {
  idCer?: number;
  ragioneSociale: string = '';
  codiceFiscale: string = '';
  comuneSedeLegale: string = '';
  provinciaSedeLegale: string = '';
  regioneLegale: string = '';
  formaGiuridica: string = '';
  telefono: number = 0;
  email: string = '';
  pec: string = '';
  sitoWeb: string = '';
  referente: string = '';
  flgCanc?: string;
  specFormaGiuridica?: string;
  partitaIVA: string = '';

  constructor(data?: Partial<GetListaCER>) {
    this.idCer = data?.idCer ?? undefined;
    this.ragioneSociale = data?.ragioneSociale ?? '';
    this.codiceFiscale = data?.codiceFiscale ?? '';
    this.comuneSedeLegale = data?.comuneSedeLegale ?? '';
    this.provinciaSedeLegale = data?.provinciaSedeLegale ?? '';
    this.regioneLegale = data?.regioneLegale ?? '';
    this.formaGiuridica = data?.formaGiuridica ?? '';
    this.telefono = data?.telefono ?? 0;
    this.email = data?.email ?? '';
    this.pec = data?.pec ?? '';
    this.sitoWeb = data?.sitoWeb ?? '';
    this.referente = data?.referente ?? '';
    this.flgCanc = data?.flgCanc ?? undefined;
    this.specFormaGiuridica = data?.specFormaGiuridica ?? undefined;
    this.partitaIVA = data?.partitaIVA ?? '';
  }
}
