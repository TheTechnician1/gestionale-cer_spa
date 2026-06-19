import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiErrorBody } from '../models';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  friendly(error: unknown): string {
    const message = this.extractMessage(error).toLowerCase();

    if (message.includes('email') && (message.includes('esist') || message.includes('registr'))) return 'Email gia registrata.';
    if (message.includes('credenzial') || message.includes('password') || message.includes('utente non')) return 'Credenziali errate.';
    if (message.includes('quantita') || message.includes('disponibil')) return 'Quantita insufficiente o prodotto non disponibile.';
    if (message.includes('saldo')) return 'Saldo insufficiente per completare il pagamento.';
    if (message.includes('carrello') && message.includes('vuoto')) return 'Il carrello e vuoto.';
    if (message.includes('ordine') && (message.includes('non') || message.includes('inesistente'))) return 'Ordine non trovato.';
    if (message.includes('pdf')) return 'Non e stato possibile generare la ricevuta.';
    if (message.includes('email')) return 'Non e stato possibile inviare la ricevuta.';
    if (message.includes('prodotto')) return 'Prodotto non disponibile.';

    return 'Qualcosa non e andato a buon fine. Riprova tra poco.';
  }

  private extractMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as ApiErrorBody | string | null;
      if (typeof body === 'string') return body;
      return body?.message || error.message || '';
    }
    return error instanceof Error ? error.message : String(error || '');
  }
}
