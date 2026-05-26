export interface DatiEnergetici {
  idSchedaEnergetica: number | null;
  idCer: number | null;
  idConfigurazione: number | null;
  annoRiferimento: string | null;
  energiaProdottaMhw: number | null;
  energiaPrelevataMhw: number | null;
  energiaImmessaMhw: number | null;
  energiaAutoconsumataMhw: number | null;
  emailUtenteLoggato: string | null;
  tariffaPremioEuro: number | null;
  corrispettivoPremioEuro: number | null;
  riduzioneCo2Ton: string | null;
  attivo: string | null;
  calcoloCo2Automatic: boolean | null;
  note: string | null;
}

export class DatiEnergeticiModel implements DatiEnergetici {

  idSchedaEnergetica: number | null;
  idCer: number | null;
  idConfigurazione: number | null;
  annoRiferimento: string | null;
  energiaProdottaMhw: number | null;
  energiaPrelevataMhw: number | null;
  energiaImmessaMhw: number | null;
  energiaAutoconsumataMhw: number | null;
  emailUtenteLoggato: string | null;
  tariffaPremioEuro: number | null;
  corrispettivoPremioEuro: number | null;
  riduzioneCo2Ton: string | null;
  attivo: string | null;
  calcoloCo2Automatic: boolean | null;
  note: string | null;

  constructor(data?: Partial<DatiEnergetici>) {

    this.idSchedaEnergetica = data?.idSchedaEnergetica ?? null;
    this.idCer = data?.idCer ?? null;
    this.idConfigurazione = data?.idConfigurazione ?? null;
    this.annoRiferimento = data?.annoRiferimento ?? null;
    this.energiaProdottaMhw = data?.energiaProdottaMhw ?? null;
    this.energiaPrelevataMhw = data?.energiaPrelevataMhw ?? null;
    this.energiaImmessaMhw = data?.energiaImmessaMhw ?? null;
    this.energiaAutoconsumataMhw = data?.energiaAutoconsumataMhw ?? null;
    this.emailUtenteLoggato = data?.emailUtenteLoggato ?? null;
    this.tariffaPremioEuro = data?.tariffaPremioEuro ?? null;
    this.corrispettivoPremioEuro = data?.corrispettivoPremioEuro ?? null;
    this.riduzioneCo2Ton = data?.riduzioneCo2Ton ?? null;
    this.attivo = data?.attivo ?? null;
    this.calcoloCo2Automatic = data?.calcoloCo2Automatic ?? null;
    this.note = data?.note ?? null;
  }
}