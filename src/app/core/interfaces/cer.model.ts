export interface CER {
  idCer: number | null,
  ragioneSociale: string | null,
  codiceFiscale: string | null,
  comuneLegale: string | null,
  provinciaLegale: string | null,
  regioneLegale: string | null,
  formaGiuridica: string | null,
  email: string | null,
  pec: string | null,
  sitoWeb: string | null,
  referente: string | null,
  specFormaGiuridica: string | null,
  partitaIva: string | null,
  telefono: string | null
}

export class CERModel implements CER {
  idCer: number | null;
  ragioneSociale: string | null;
  codiceFiscale: string | null;
  comuneLegale: string | null;
  provinciaLegale: string | null;
  regioneLegale: string | null;
  formaGiuridica: string | null;
  email: string | null;
  pec: string | null;
  sitoWeb: string | null;
  referente: string | null;
  specFormaGiuridica: string | null;
  partitaIva: string | null;
  telefono: string | null;


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
    this.specFormaGiuridica = data?.specFormaGiuridica ?? null;
    this.partitaIva = data?.partitaIva ?? null;
    this.telefono = data?.telefono ?? null;
  }
}