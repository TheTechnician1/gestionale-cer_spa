export interface Utente {
  idUtente?: number | null;
  nome?: string | null;
  cognome?: string | null;
  messaggio?: string | null;
  ruolo: string | null;
}

export class UtenteModel implements Utente {
  idUtente?: number | null;
  nome?: string | null;
  cognome?: string | null;
  messaggio?: string | null;
  ruolo: string | null;

  constructor(data?: Partial<Utente>) {
    this.idUtente = data?.idUtente ?? null;
    this.nome = data?.nome ?? null;
    this.cognome = data?.cognome ?? null;
    this.ruolo = data?.ruolo ?? null;
    this.messaggio = data?.messaggio ?? null;
  }
}

export interface RegistrazioneUtente {
  nome: string;
  cognome: string;
  codiceFiscale: string;
  email: string;
  numeroTelefono: string;
  ruolo: string;
  password: string;
}

export interface RicercaCerRequest {
  partitaIva?: string;
  regioneLegale?: string;
  provinciaLegale?: string;
  comuneSedeLegale?: string;
  codiceFiscale?: string;
  ragioneSociale?: string;
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

export interface UbicazioneImpianto {
  regione: string;
  regioneNome: string;
  provincia: string;
  comune: string;
  comuneNome: string;
  codTipoInst: string;
  sitoInstallazione: string;
  idConfigurazione: number;
  codTipologia: string;
}

export interface ImpiantoCER {
  idImpianto: number;
  idConfigurazione: number;
  codiceCabina: string;
  dataEsercizio: string;
  codTipologia: string;
  tipologia: string;
  partitaIva: string;
  codCatProd: string;
  categoriaProduttore: string;
  ubicazioni: UbicazioneImpianto[];
}

export type AnagraficaCER = GetListaCER;

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
