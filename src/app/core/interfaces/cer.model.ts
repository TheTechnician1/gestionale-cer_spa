export interface CER {
  idCer: number | null,
  ragioneSociale: string | null,
  codiceFiscale: string | null,
  comuneLegale: ComuneLegale | null,
  provinciaLegale: ProvinciaLegale | null,
  regioneLegale: RegioneLegale | null,
  formaGiuridica: FormaGiuridica | null,
  email: string | null,
  pec: string | null,
  sitoWeb: string | null,
  referente: string | null,
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
  ragioneSociale: string | null;
  codiceFiscale: string | null;
  comuneLegale: ComuneLegale | null;
  provinciaLegale: ProvinciaLegale | null;
  regioneLegale: RegioneLegale | null;
  formaGiuridica: FormaGiuridica | null;
  email: string | null;
  pec: string | null;
  sitoWeb: string | null;
  referente: string | null;
  partitaIva: string | null;
  telefono: string | null;
  flgCancellazione: boolean | null;

  constructor(data?: Partial<CER>) {
    this.idCer = data?.idCer ?? null;
    this.ragioneSociale = data?.ragioneSociale ?? null;
    this.codiceFiscale = data?.codiceFiscale ?? null;
    this.comuneLegale = data?.comuneLegale ?? null;
    this.provinciaLegale = data?.provinciaLegale ?? null;
    this.regioneLegale = data?.regioneLegale ?? null;
    this.formaGiuridica = data?.formaGiuridica ?? null;
    this.email = data?.email ?? null;
    this.pec = data?.pec ?? null;
    this.sitoWeb = data?.sitoWeb ?? null;
    this.referente = data?.referente ?? null;
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