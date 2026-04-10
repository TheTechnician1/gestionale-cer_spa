export interface ConfigurazioneCabinaPrimaria {
  id_config: string | null;
  id_cer: string | null;
  codice_cabina: string | null;
  anno_attivazione: string | null;
  flg_cancellazione?: string | null; // S= cancellata, N= attiva
}

export class ConfigurazioneCabinaPrimariaModel implements ConfigurazioneCabinaPrimaria {
  id_config: string | null;
  id_cer: string | null;
  codice_cabina: string | null;
  anno_attivazione: string | null;
  flg_cancellazione?: string | null;

  constructor(data?: Partial<ConfigurazioneCabinaPrimaria>) {
    this.id_config = data?.id_config ?? null;
    this.id_cer = data?.id_cer ?? null;
    this.codice_cabina = data?.codice_cabina ?? null;
    this.anno_attivazione = data?.anno_attivazione ?? null;
    this.flg_cancellazione = data?.flg_cancellazione ?? null;
  }
}
