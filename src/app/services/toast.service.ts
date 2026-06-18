import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type TipoToast = 'successo' | 'errore' | 'info';

export interface ToastMessage {
  testo: string;
  tipo: TipoToast;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  toast$ = this.toastSubject.asObservable();

  private timeoutId?: number;
  private codaToast: ToastMessage[] = [];

  mostraSuccesso(testo: string): void {
    this.mostraToast(testo, 'successo');
  }

  mostraErrore(testo: string): void {
    this.mostraToast(testo, 'errore');
  }

  mostraInfo(testo: string): void {
    this.mostraToast(testo, 'info');
  }

  chiudiToast(): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    const prossimoToast = this.codaToast.shift();

    if (prossimoToast) {
      this.pubblicaToast(prossimoToast);
      return;
    }

    this.toastSubject.next(null);
  }

  private mostraToast(testo: string, tipo: TipoToast): void {
    const toast: ToastMessage = { testo, tipo };

    if (this.toastSubject.getValue()) {
      this.codaToast.push(toast);
      return;
    }

    this.pubblicaToast(toast);
  }

  private pubblicaToast(toast: ToastMessage): void {
    this.toastSubject.next(toast);

    this.timeoutId = window.setTimeout(() => {
      this.chiudiToast();
    }, 3000);
  }
}