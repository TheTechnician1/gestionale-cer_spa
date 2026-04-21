import { CER } from "./cer.model";

export interface Configurazione {
  idConfigurazione: number | null,
  cer: CER | null,
  idCer: number | null,
  codiceCabina: string | null,
  annoAttivazione: string | null,
  emailUtenteLoggato: string | null,
  flg_cancellazione: string | null
}

export class ConfigurazioneModel implements Configurazione {
  idConfigurazione: number | null;
  cer: CER | null;
  idCer: number | null;
  codiceCabina: string | null;
  annoAttivazione: string | null;
  emailUtenteLoggato: string | null;
  flg_cancellazione: string | null;

  constructor(data?: Partial<Configurazione>) {
    this.idConfigurazione = data?.idConfigurazione ?? null;
    this.cer = data?.cer ?? null;
    this.idCer = data?.idCer ?? null;
    this.codiceCabina = data?.codiceCabina ?? null;
    this.annoAttivazione = data?.annoAttivazione ?? null;
    this.emailUtenteLoggato = data?.emailUtenteLoggato ?? null;
    this.flg_cancellazione = data?.flg_cancellazione ?? null;
  }
}
