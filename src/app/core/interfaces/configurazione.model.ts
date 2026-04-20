export interface Configurazione {
  id_configurazione: string | null,
  id_cer: string | null,
  codice_cabina: string | null,
  anno_attivazione: string | null
}

export class ConfigurazioneModel implements Configurazione {
  id_configurazione: string | null;
  id_cer: string | null;
  codice_cabina: string | null;
  anno_attivazione: string | null;

  constructor(data?: Partial<Configurazione>) {
    this.id_configurazione = data?.id_configurazione ?? null;
    this.id_cer = data?.id_cer ?? null;
    this.codice_cabina = data?.codice_cabina ?? null;
    this.anno_attivazione = data?.anno_attivazione ?? null;
  }
}
