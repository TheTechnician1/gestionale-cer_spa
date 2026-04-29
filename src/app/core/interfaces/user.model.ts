export interface Utente {
  email?: string | null;
  idUtente?: number | null;
  nome?: string | null;
  cognome?: string | null;
  messaggio?: string | null;
  ruolo: string | null;
  token: string | null
}

export class UtenteModel implements Utente {
  email?: string | null;
  idUtente?: number | null;
  nome?: string | null;
  cognome?: string | null;
  messaggio?: string | null;
  ruolo: string | null;
  token: string | null;

  constructor(data?: Partial<Utente>) {
    this.email = data?.email ?? null;
    this.idUtente = data?.idUtente ?? null;
    this.nome = data?.nome ?? null;
    this.cognome = data?.cognome ?? null;
    this.messaggio = data?.messaggio ?? null;
    this.ruolo = data?.ruolo ?? null;
    this.token = data?.token ?? null
  }
}
  export interface UserTest {
    nome: string,
    cognome: string,
    codiceFiscale: string,
    numeroTelefono: number,
    ruolo: string,
    credenziali: {
    email: string,
    password: string
  }
}


  

export interface User{
  nome?: string | null,
  cognome?: string | null,
  codiceFiscale?: string | null,
  email: string | null,
  numeroTelefono?: number | null,
  ruolo: string | null,
  password: string | null,
   credenziali: {
    email: string | null,
    password: string | null,
   } | null
}

export class UserModel implements User {
  nome?: string | null;
  cognome?: string | null;
  codiceFiscale?: string | null;
  email: string | null = '';
  numeroTelefono?: number | null;
  ruolo: string | null = '';
  password: string | null = '';
  credenziali: {
    email: string | null,
    password: string | null,
  } | null;

  constructor (data?: Partial<User>){
    this.nome = data?.nome ?? null
    this.cognome = data?.cognome ?? null
    this.codiceFiscale = data?.codiceFiscale ?? null
    this.email = data?.email ?? null
    this.numeroTelefono = data?.numeroTelefono ?? null
    this.ruolo = data?.ruolo ?? null
    this.password = data?.password ?? null
    this.credenziali = data?.credenziali ?? null
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

export interface AccessoRequest {
  email: string;
  password: string;
}

export interface AnagraficaUtenti{
  nome: string;
  cognome: string;
  email: string;
  ruolo: string;
}

export interface GetListaCER{
  idCer?: number,
  ragioneSociale: string,
  codiceFiscale: string,
  comuneSedeLegale: string,
  provinciaSedeLegale: string,
  regioneLegale: string,
  formaGiuridica: string,
  telefono: number | null,
  email: string,
  pec: string,
  sitoWeb: string,
  referente: string,
  flgCanc?: string,
  nomeProprietario?: string,
  cognomeProprietario?: string,
   specFormaGiuridica?: string
 partitaIVA: string,
 
}

export interface UbicazioneImpianto {
  regione?: string;
  regioneNome?: string;
  provincia?: string;
  comune?: string;
  comuneNome?: string;
  codTipoInst?: string;
  sitoInstallazione?: string;
  indirizzo?: string;
  numCivico?: string;
  cap?: string;
  idConfigurazione?: number;
  codTipologia?: string;
}

export interface ImpiantoCER {
  idImpianto?: number;
  idConfigurazione?: number;
  configurazione?: ConfigurazioneCabina;
  codiceCabina?: string;
  dataEsercizio?: string;
  codTipologia?: string;
  tipologia?: string;
  partitaIva?: string;
  codCatProd?: string;
  categoriaProduttore?: string;
  potenzaNominale?: number;
  isEsercizio?: boolean;
  accumuloPresente?: boolean;
  capacitaAccumulo?: number;
  ubicazioni?: UbicazioneImpianto[];
  sezioneCer?: {
    ragioneSociale?: string;
    partitaIva?: string;
    regione?: string;
    provincia?: string;
    comune?: string;
  };
  sezioneConfigurazione?: {
    idConfigurazione?: number;
    descConfigurazione?: string;
  };
  sezioneImpianto?: {
    dataEsercizio?: string;
    tipologia?: string;
    potenzaNominale?: number;
    isEsercizio?: boolean;
    accumulo?: {
      presente?: boolean;
      capacita?: number;
    };
    ubicazione?: UbicazioneImpianto;
  };
}

export interface ConfigurazioneCabina {
  idConfig?: number;
  idConfigurazione?: number;
  idCer?: number;
  codiceCabina?: string;
  codCabina?: string;
  annoAttivazione?: number;
  stato?: string;
  flgCanc?: string;
  flgcancellazione?: string;
  cer?: GetListaCER;
  impianti?: ImpiantoCER[];
  datiEnergetici?: DatiEnergetici[];
}

export interface RicercaConfigurazioneRequest {
  idConfig?: number | null;
  idCer?: number | null;
  codiceCabina?: string;
  annoAttivazione?: number | null;
  stato?: string;
}

export interface ConfigurazionePayload {
  idConfig: number;
  idCer: number;
  codiceCabina: string;
  annoAttivazione: number;
  flgcancellazione: string;
}

export interface RicercaImpiantoRequest {
  annoAttivazioneDa?: number | null;
  annoAttivazioneA?: number | null;
  partitaIva?: string;
  regione?: string;
  provincia?: string;
  comune?: string;
  codiceCabina?: string;
  codTipologia?: string;
  categoriaProduttore?: string;
  codTipoInst?: string;
}

export interface ImpiantoPayload {
  idImpianto?: number;
  idConfigurazione?: number;
  codiceCabina?: string;
  dataEsercizio?: string;
  codTipologia?: string;
  tipologia?: string;
  partitaIva?: string;
  codCatProd?: string;
  categoriaProduttore?: string;
  ubicazioni?: UbicazioneImpianto[];
}

export interface ModificaImpiantoPayload {
  idImpianto: number;
  configurazione?: {
    idConfig?: number;
    codiceCabina?: string;
  };
  flgEsercizio?: string;
  dataEserc?: string;
  codTipologia?: string;
  preNom?: number;
  flgAccumulo?: boolean;
  capAccumulo?: number;
  tipoProduttore?: boolean;
  codCatProduttore?: string;
  flgCanc?: string;
  specTipologia?: string;
  specCatProduttore?: string;
  codSitoInst?: string;
}

export interface DatiEnergetici {
  idDati?: number;
  idCer: number;
  idConfigurazione: number;
  anno?: string;
  geteProdotta?: number;
  getePrelevata?: number;
  geteImmessa?: number;
  geteCondivisa?: number;
  geteAutoCons?: number;
  tariffaPremium?: number;
  corrPremioOtt?: number;
  ridEmCo2?: string;
  statoScheda?: string;
  flgCanc?: string;
  codiceCabina?: string;
  partitaIva?: string;
}

export interface RicercaDatiEnergeticiRequest {
  daAnno?: string;
  getaAnno?: string;
  partitaIva?: string;
  codiceCabina?: string;
  stato?: string;
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
  telefono: number | null;
  email: string = '';
  pec: string = '';
  sitoWeb: string = '';
  referente: string = '';
  flgCanc?: string;
  nomeProprietario?: string;
  cognomeProprietario?: string;
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
    this.telefono = data?.telefono ?? null;
    this.email = data?.email ?? '';
    this.pec = data?.pec ?? '';
    this.sitoWeb = data?.sitoWeb ?? '';
    this.referente = data?.referente ?? '';
    this.flgCanc = data?.flgCanc ?? undefined;
    this.nomeProprietario = data?.nomeProprietario ?? undefined;
    this.cognomeProprietario = data?.cognomeProprietario ?? undefined;
    this.specFormaGiuridica = data?.specFormaGiuridica ?? undefined;
    this.partitaIVA = data?.partitaIVA ?? '';
  }
}
