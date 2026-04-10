export interface DatiEnergetici {
  id_dati: string | null;
  id_cer: string | null;
  id_config: string | null;
  anno: string | null;
  e_prodotta?: number | null;
  e_prelevata?: number | null;
  e_immessa?: number | null;
  e_condivisa?: number | null;
  e_auto_cons?: number | null;
  tariffa_premium?: number | null;
  corr_premio_ott?: number | null;
  rid_em_co2: string | null;
  fla_cancellazione?: string | null; // S= cancellata, N= attiva
}

export class DatiEnergeticiModel implements DatiEnergetici {
  id_dati: string | null;
  id_cer: string | null;
  id_config: string | null;
  anno: string | null;
  e_prodotta?: number | null;
  e_prelevata?: number | null;
  e_immessa?: number | null;
  e_condivisa?: number | null;
  e_auto_cons?: number | null;
  tariffa_premium?: number | null;
  corr_premio_ott?: number | null;
  rid_em_co2: string | null;
  fla_cancellazione?: string | null;

  constructor(data?: Partial<DatiEnergetici>) {
    this.id_dati = data?.id_dati ?? null;
    this.id_cer = data?.id_cer ?? null;
    this.id_config = data?.id_config ?? null;
    this.anno = data?.anno ?? null;
    this.e_prodotta = data?.e_prodotta ?? null;
    this.e_prelevata = data?.e_prelevata ?? null;
    this.e_immessa = data?.e_immessa ?? null;
    this.e_condivisa = data?.e_condivisa ?? null;
    this.e_auto_cons = data?.e_auto_cons ?? null;
    this.tariffa_premium = data?.tariffa_premium ?? null;
    this.corr_premio_ott = data?.corr_premio_ott ?? null;
    this.rid_em_co2 = data?.rid_em_co2 ?? null;
    this.fla_cancellazione = data?.fla_cancellazione ?? null;
  }
}
