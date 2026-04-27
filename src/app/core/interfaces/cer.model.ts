export interface CER {
  idCer: number | null,
  ragSociale: string | null,
  ragioneSociale: string | null,
  codFisc: string | null,
  codFiscale: string | null,
  codiceFiscale: string | null,
  comune: ComuneLegale | null,
  comuneLegale: ComuneLegale | null,
  provincia: ProvinciaLegale | null,
  provinciaLegale: ProvinciaLegale | null,
  regione: RegioneLegale | null,
  regioneLegale: RegioneLegale | null,
  formaGiuridica: FormaGiuridica | null,
  email: string | null,
  pec: string | null,
  sitoWeb: string | null,
  referente: string | null,
  pIva: string | null,
  partitaIva: string | null,
  telefono: string | null,
  flgCancellazione: boolean | null
}

export interface ComuneLegale {
  codice: string | null,
  descrizione: string | null,
  specifica: string | null
}

export interface ProvinciaLegale {
  codice: string | null,
  descrizione: string | null,
  specifica: string | null
}

export interface RegioneLegale {
  codice: string | null,
  descrizione: string | null,
  specifica: string | null
}

export interface FormaGiuridica {
  codice: string | null,
  descrizione: string | null,
  specifica: string | null
}

export class CERModel implements CER {
  idCer: number | null;
  ragSociale: string | null;
  ragioneSociale: string | null;
  codFisc: string | null;
  codFiscale: string | null;
  codiceFiscale: string | null;
  comune: ComuneLegale | null;
  comuneLegale: ComuneLegale | null;
  provincia: ProvinciaLegale | null;
  provinciaLegale: ProvinciaLegale | null;
  regione: RegioneLegale | null;
  regioneLegale: RegioneLegale | null;
  formaGiuridica: FormaGiuridica | null;
  email: string | null;
  pec: string | null;
  sitoWeb: string | null;
  referente: string | null;
  pIva: string | null;
  partitaIva: string | null;
  telefono: string | null;
  flgCancellazione: boolean | null;

  constructor(data?: Partial<CER>) {
    this.idCer = data?.idCer ?? null;
    this.ragSociale = data?.ragSociale ?? null;
    this.ragioneSociale = data?.ragioneSociale ?? null;
    this.codFisc = data?.codFisc ?? null;
    this.codFiscale = data?.codFiscale ?? null;
    this.codiceFiscale = data?.codiceFiscale ?? null;
    this.comune = data?.comune ?? null;
    this.comuneLegale = data?.comuneLegale ?? null;
    this.provincia = data?.provincia ?? null;
    this.provinciaLegale = data?.provinciaLegale ?? null;
    this.regione = data?.regione ?? null;
    this.regioneLegale = data?.regioneLegale ?? null;
    this.formaGiuridica = data?.formaGiuridica ?? null;
    this.email = data?.email ?? null;
    this.pec = data?.pec ?? null;
    this.sitoWeb = data?.sitoWeb ?? null;
    this.referente = data?.referente ?? null;
    this.pIva = data?.pIva ?? null;
    this.partitaIva = data?.partitaIva ?? null;
    this.telefono = data?.telefono ?? null;
    this.flgCancellazione = data?.flgCancellazione ?? null;
  }
}

export class ComuneLegaleModel implements ComuneLegale {
  codice: string | null;
  descrizione: string | null;
  specifica: string | null;

  constructor(data?: Partial<ComuneLegale>) {
    this.codice = data?.codice ?? null;
    this.descrizione = data?.descrizione ?? null;
    this.specifica = data?.specifica ?? null;
  }
}

export class ProvinciaLegaleModel implements ProvinciaLegale {
  codice: string | null;
  descrizione: string | null;
  specifica: string | null;

  constructor(data?: Partial<ProvinciaLegale>) {
    this.codice = data?.codice ?? null;
    this.descrizione = data?.descrizione ?? null;
    this.specifica = data?.specifica ?? null;
  }
}

export class RegioneLegaleModel implements RegioneLegale {
  codice: string | null;
  descrizione: string | null;
  specifica: string | null;

  constructor(data?: Partial<RegioneLegale>) {
    this.codice = data?.codice ?? null;
    this.descrizione = data?.descrizione ?? null;
    this.specifica = data?.specifica ?? null;
  }
}

export class FormaGiuridicaModel implements FormaGiuridica {
  codice: string | null;
  descrizione: string | null;
  specifica: string | null;

  constructor(data?: Partial<FormaGiuridica>) {
    this.codice = data?.codice ?? null;
    this.descrizione = data?.descrizione ?? null;
    this.specifica = data?.specifica ?? null;
  }
}
