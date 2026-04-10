import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface ToastPayload {
  title?: string;
  message: string;
}

@Injectable({ providedIn: "root" })
export class ToastService {
  private readonly toastSubject = new Subject<ToastPayload>();

  readonly toast$ = this.toastSubject.asObservable();

  show(toast: ToastPayload): void {
    this.toastSubject.next(toast);
  }
}
