export interface DatiEnergetici {
  id_dati: string | null,
  id_cer: string | null,
  id_config: string | null,
  anno: string | null,
  energia_prodotta: number | null,
  energia_prelevata: number | null,
  energia_immessa: number | null,
  energia_condivisa: number | null,
  energia_autoconsumata: number | null,
  tariffa_premio: number | null,
  corrispettivo_premio: number | null,
  riduzione_emissione: string | null
}

export class DatiEnergeticiModel implements DatiEnergetici {
  id_dati: string | null;
  id_cer: string | null;
  id_config: string | null;
  anno: string | null;
  energia_prodotta: number | null;
  energia_prelevata: number | null;
  energia_immessa: number | null;
  energia_condivisa: number | null;
  energia_autoconsumata: number | null;
  tariffa_premio: number | null;
  corrispettivo_premio: number | null;
  riduzione_emissione: string | null;

  constructor(data?: Partial<DatiEnergetici>) {
    this.id_dati = data?.id_dati ?? null;
    this.id_cer = data?.id_cer ?? null;
    this.id_config = data?.id_config ?? null;
    this.anno = data?.anno ?? null;
    this.energia_prodotta = data?.energia_prodotta ?? null;
    this.energia_prelevata = data?.energia_prelevata ?? null;
    this.energia_immessa = data?.energia_immessa ?? null;
    this.energia_condivisa = data?.energia_condivisa ?? null;
    this.energia_autoconsumata = data?.energia_autoconsumata ?? null;
    this.tariffa_premio = data?.tariffa_premio ?? null;
    this.corrispettivo_premio = data?.corrispettivo_premio ?? null;
    this.riduzione_emissione = data?.riduzione_emissione ?? null;
  }
}

