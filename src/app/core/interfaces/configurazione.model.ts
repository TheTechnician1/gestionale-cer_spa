import { CER, RegioneLegale } from './cer.model';

export interface Configurazione {
  idConfigurazione: number | null,
  cer: CER | null,
  idCer: number | null,
  codiceCabina: string | null,
  annoAttivazione: string | null,
  partitaIva: string | null,
  ragioneSociale: string | null,
  regioneLegale: string | null,
  emailUtenteLoggato: string | null,
  flg_cancellazione: string | null
}

export class ConfigurazioneModel implements Configurazione {
  idConfigurazione: number | null;
  cer: CER | null;
  idCer: number | null;
  codiceCabina: string | null;
  annoAttivazione: string | null;
  partitaIva: string | null;
  ragioneSociale: string | null;
  regioneLegale: string | null;
  emailUtenteLoggato: string | null;
  flg_cancellazione: string | null;

  constructor(data?: Partial<Configurazione>) {
    this.idConfigurazione = data?.idConfigurazione ?? null;
    this.cer = data?.cer ?? null;
    this.idCer = data?.idCer ?? null;
    this.codiceCabina = data?.codiceCabina ?? null;
    this.annoAttivazione = data?.annoAttivazione ?? null;
    this.partitaIva = data?.partitaIva ?? null;
    this.ragioneSociale = data?.ragioneSociale ?? null;
    this.regioneLegale = data?.regioneLegale ?? null;
    this.emailUtenteLoggato = data?.emailUtenteLoggato ?? null;
    this.flg_cancellazione = data?.flg_cancellazione ?? null;
  }
}
