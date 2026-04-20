export interface CER {
  id_cer: number | null,
  ragione_sociale: string | null,
  codice_fiscale: string | null,
  partita_iva: string | null,
  comune_sede_legale: string | null,
  provincia_sede_legale: string | null,
  regione_legale: string | null,
  forma_giuridica: string | null,
  flag_cancellato: boolean | null,
  contatti: Contatti[] | null;
}

export interface Contatti {
  telefono: string | null,
  email: string | null,
  pec: string | null,
  sito_web: string | null,
  referente: string | null
}

export class CERModel implements CER {
  id_cer: number | null;
  ragione_sociale: string | null;
  codice_fiscale: string | null;
  partita_iva: string | null;
  comune_sede_legale: string | null;
  provincia_sede_legale: string | null;
  regione_legale: string | null;
  forma_giuridica: string | null;
  flag_cancellato: boolean | null;
  contatti: Contatti[] | null;

  constructor(data?: Partial<CER>) {
    this.id_cer = data?.id_cer ?? null;
    this.ragione_sociale = data?.ragione_sociale ?? null;
    this.codice_fiscale = data?.codice_fiscale ?? null;
    this.partita_iva = data?.partita_iva ?? null;
    this.comune_sede_legale = data?.comune_sede_legale ?? null;
    this.provincia_sede_legale = data?.provincia_sede_legale ?? null;
    this.regione_legale = data?.regione_legale ?? null;
    this.forma_giuridica = data?.forma_giuridica ?? null;
    this.flag_cancellato = data?.flag_cancellato ?? null;
    this.contatti = data?.contatti ?? null;
  }
}

export class ContattiModel implements Contatti {
  telefono: string | null;
  email: string | null;
  pec: string | null;
  sito_web: string | null;
  referente: string | null;

  constructor(data?: Partial<Contatti>) {
    this.telefono = data?.telefono ?? null;
    this.email = data?.email ?? null;
    this.pec = data?.pec ?? null;
    this.sito_web = data?.sito_web ?? null;
    this.referente = data?.referente ?? null;
  }
}