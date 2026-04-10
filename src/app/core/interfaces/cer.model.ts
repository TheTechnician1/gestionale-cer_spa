export interface Cer {
  id_cer: string | null;
  rag_sociale: string | null;
  cod_fisc: string | null;
  partita_iva?: string | null;
  comune_legale: string | null;
  provincia_legale: string | null;
  regione_legale: string | null;
  forma_giuridica: string | null;
  telefono?: string | null;
  e_mail: string | null;
  pec: string | null;
  sito_web?: string | null;
  referente: string | null;
  flg_cancellazione?: string | null; // S= cancellata, N= attiva
}

export class CerModel implements Cer {
  id_cer: string | null;
  rag_sociale: string | null;
  cod_fisc: string | null;
  partita_iva?: string | null;
  comune_legale: string | null;
  provincia_legale: string | null;
  regione_legale: string | null;
  forma_giuridica: string | null;
  telefono?: string | null;
  e_mail: string | null;
  pec: string | null;
  sito_web?: string | null;
  referente: string | null;
  flg_cancellazione?: string | null;

  constructor(data?: Partial<Cer>) {
    this.id_cer = data?.id_cer ?? null;
    this.rag_sociale = data?.rag_sociale ?? null;
    this.cod_fisc = data?.cod_fisc ?? null;
    this.partita_iva = data?.partita_iva ?? null;
    this.comune_legale = data?.comune_legale ?? null;
    this.provincia_legale = data?.provincia_legale ?? null;
    this.regione_legale = data?.regione_legale ?? null;
    this.forma_giuridica = data?.forma_giuridica ?? null;
    this.telefono = data?.telefono ?? null;
    this.e_mail = data?.e_mail ?? null;
    this.pec = data?.pec ?? null;
    this.sito_web = data?.sito_web ?? null;
    this.referente = data?.referente ?? null;
    this.flg_cancellazione = data?.flg_cancellazione ?? null;
  }
}
