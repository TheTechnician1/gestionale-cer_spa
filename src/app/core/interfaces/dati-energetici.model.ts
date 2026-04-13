export interface DatiEnergetici {
  id_dati: string,
  id_cer: string,
  id_config: string,
  anno: string,
  energia_prodotta: number,
  energia_prelevata: number,
  energia_immessa: number,
  energia_condivisa: number,
  energia_autoconsumata: number,
  tariffa_premio: number,
  corrispettivo_premio: number,
  riduzione_emissione: string
}
