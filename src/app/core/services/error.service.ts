import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private errore = new BehaviorSubject<boolean>(false);
  errore$ = this.errore.asObservable();

  setErrore() {
    this.errore.next(true);
  }
  clearErrore() {
    this.errore.next(false);
  }
}
