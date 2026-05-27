import { Injectable } from '@angular/core';
import { UtenteService } from './utente.service';

export type RuoloNormalizzato = 'ADM' | 'GEST' | 'GUEST';

@Injectable({ providedIn: 'root' })
export class PermessiService {
  constructor(private auth: UtenteService) {}

  /** Normalizza qualsiasi alias di ruolo in ADM/GEST/GUEST. */
  normalizza(r: string | null | undefined): RuoloNormalizzato | null {
    if (!r) return null;
    const u = String(r).toUpperCase();
    if (u === 'ADM' || u === 'ADMIN') return 'ADM';
    if (u === 'GEST' || u === 'GESTORE') return 'GEST';
    if (u === 'GUEST') return 'GUEST';
    return null;
  }

  get ruolo(): RuoloNormalizzato | null {
    return this.normalizza(this.auth.getRole());
  }

  isAdm(): boolean {
    return this.ruolo === 'ADM';
  }

  isGest(): boolean {
    return this.ruolo === 'GEST';
  }

  isGuest(): boolean {
    return this.ruolo === 'GUEST';
  }

  /** ADM e GEST possono creare/modificare impianti e dati energetici. */
  puoCreare(): boolean {
    return this.ruolo === 'ADM' || this.ruolo === 'GEST';
  }

  puoModificare(): boolean {
    return this.puoCreare();
  }

  /** Solo ADM può fare cancellazioni logiche. */
  puoEliminare(): boolean {
    return this.ruolo === 'ADM';
  }

  /** Verifica permesso contro una lista (route data, sidebar, ecc.). */
  haUnoDei(ruoli: string[] | undefined): boolean {
    if (!ruoli || ruoli.length === 0) return true;
    const normalizzati = ruoli
      .map((r) => this.normalizza(r))
      .filter((r): r is RuoloNormalizzato => r !== null);
    return !!this.ruolo && normalizzati.includes(this.ruolo);
  }
}
