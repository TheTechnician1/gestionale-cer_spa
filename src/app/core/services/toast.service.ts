import { Injectable, ViewContainerRef } from "@angular/core";
import { HttpErrorResponse, HttpRequest, HttpResponse } from "@angular/common/http";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { ToastSnackbarComponent } from "src/app/shared/components/toast-snackbar/toast-snackbar.component";
import { ToastSnackbarData, ToastType } from "src/app/shared/components/toast-snackbar/toast-snackbar.model";

interface ToastMessage {
  title: string;
  message: string;
  type: ToastType;
  statusCode?: number;
  duration?: number;
}

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private viewContainerRef?: ViewContainerRef;
  private readonly defaultDuration = 5000;

  constructor(private snackBar: MatSnackBar) {}

  registerViewContainerRef(viewContainerRef: ViewContainerRef): void {
    this.viewContainerRef = viewContainerRef;
  }

  clearViewContainerRef(viewContainerRef: ViewContainerRef): void {
    if (this.viewContainerRef === viewContainerRef) {
      this.viewContainerRef = undefined;
    }
  }

  success(message: string, title: string = "Operazione completata"): void {
    this.show({ type: "success", title, message });
  }

  error(message: string, title: string = "Errore"): void {
    this.show({ type: "error", title, message });
  }

  warning(message: string, title: string = "Attenzione"): void {
    this.show({ type: "warning", title, message });
  }

  info(message: string, title: string = "Informazione"): void {
    this.show({ type: "info", title, message });
  }

  show(config: ToastMessage): void {
    const data: ToastSnackbarData = {
      title: config.title,
      message: config.message,
      type: config.type,
      statusCode: config.statusCode,
    };

    const snackbarConfig: MatSnackBarConfig<ToastSnackbarData> = {
      data,
      duration: config.duration ?? this.defaultDuration,
      horizontalPosition: "left",
      verticalPosition: "top",
      panelClass: ["app-toast-snackbar-panel", `app-toast-${config.type}`],
      viewContainerRef: this.viewContainerRef,
    };

    this.snackBar.openFromComponent(ToastSnackbarComponent, snackbarConfig);
  }

  showFromHttpSuccess(request: HttpRequest<unknown>, response: HttpResponse<unknown>): void {
    const message = this.buildSuccessToast(request, response);
    if (!message) {
      return;
    }

    this.show(message);
  }

  showFromHttpError(request: HttpRequest<unknown>, error: HttpErrorResponse): void {
    this.show(this.buildErrorToast(request, error));
  }

  private buildSuccessToast(request: HttpRequest<unknown>, response: HttpResponse<unknown>): ToastMessage | null {
    const payload = this.readPayload(response.body);
    const inferredType = this.resolveToastType(payload["status"] ?? payload["type"] ?? response.status, response.status);
    const title = this.pickFirstString(payload, ["titolo", "title", "messageTitle", "statusText"]) ?? this.defaultSuccessTitle(request.method);

    const payloadMessage = this.pickFirstString(payload, ["messaggio", "message", "descrizione", "description", "dettaglio", "detail", "testo", "text"]);
    const textBodyMessage = this.extractTextBody(response.body);
    const message = payloadMessage ?? textBodyMessage;

    if (!message) {
      if (request.method === "GET") {
        return null;
      }

      return {
        type: inferredType,
        title,
        message: this.defaultSuccessMessage(request.method),
        statusCode: response.status,
      };
    }

    return {
      type: inferredType,
      title,
      message,
      statusCode: response.status,
    };
  }

  private buildErrorToast(_request: HttpRequest<unknown>, error: HttpErrorResponse): ToastMessage {
    const payload = this.readPayload(error.error);

    const title =
      this.pickFirstString(payload, ["titolo", "title", "messageTitle"]) ??
      this.defaultErrorTitle(error.status);

    const payloadMessage = this.pickFirstString(payload, ["messaggio", "message", "descrizione", "description", "dettaglio", "detail", "testo", "text", "error", "errore"]);
    const textBodyMessage = this.extractTextBody(error.error);
    const fallbackMessage = this.defaultErrorMessage(error.status);

    return {
      type: this.resolveToastType(payload["status"] ?? payload["type"] ?? error.status, error.status, true),
      title,
      message: payloadMessage ?? textBodyMessage ?? fallbackMessage,
      statusCode: error.status,
    };
  }

  private defaultSuccessTitle(method: string): string {
    if (method === "POST") {
      return "Salvato";
    }

    if (method === "PUT" || method === "PATCH") {
      return "Modifiche salvate";
    }

    if (method === "DELETE") {
      return "Eliminato";
    }

    return "Tutto a posto";
  }

  private defaultSuccessMessage(method: string): string {
    if (method === "POST") {
      return "Elemento creato correttamente. Lo trovi nella lista.";
    }

    if (method === "PUT" || method === "PATCH") {
      return "Le modifiche sono state applicate.";
    }

    if (method === "DELETE") {
      return "L'elemento è stato eliminato. Aggiorna la lista per vedere i risultati.";
    }

    return "Operazione completata.";
  }

  private defaultErrorTitle(statusCode: number): string {
    if (statusCode === 0) {
      return "Server non raggiungibile";
    }

    if (statusCode === 401) {
      return "Sessione scaduta";
    }

    if (statusCode === 403) {
      return "Operazione non permessa";
    }

    if (statusCode === 404) {
      return "Elemento non trovato";
    }

    if (statusCode === 409) {
      return "Conflitto con i dati";
    }

    if (statusCode === 400 || statusCode === 422) {
      return "Dati non validi";
    }

    if (statusCode >= 500) {
      return "Servizio non disponibile";
    }

    return "Operazione non riuscita";
  }

  private defaultErrorMessage(statusCode: number): string {
    if (statusCode === 0) {
      return "Impossibile contattare il server. Controlla la connessione e riprova.";
    }

    if (statusCode === 401) {
      return "La sessione è scaduta o non sei autenticato. Effettua di nuovo il login per continuare.";
    }

    if (statusCode === 403) {
      return "Il tuo ruolo non permette questa operazione. Se serve l'accesso, contatta un amministratore.";
    }

    if (statusCode === 404) {
      return "L'elemento richiesto non esiste o è stato rimosso. Aggiorna la pagina e riprova.";
    }

    if (statusCode === 409) {
      return "Esiste già un elemento con questi dati. Modifica i valori e riprova.";
    }

    if (statusCode === 400 || statusCode === 422) {
      return "Alcuni campi non sono corretti. Controlla i dati inseriti e riprova.";
    }

    if (statusCode >= 500) {
      return "Il server ha avuto un problema. Riprova fra qualche istante; se persiste avvisa l'assistenza.";
    }

    return "Operazione non completata. Riprova fra poco.";
  }

  private readPayload(raw: unknown): Record<string, unknown> {
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      return raw as Record<string, unknown>;
    }

    if (typeof raw !== "string") {
      return {};
    }

    const trimmed = raw.trim();
    if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
      return {};
    }

    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return {};
    }

    return {};
  }

  private pickFirstString(payload: Record<string, unknown>, keys: string[]): string | null {
    for (const key of keys) {
      const value = payload[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }

    return null;
  }

  private extractTextBody(raw: unknown): string | null {
    if (typeof raw !== "string") {
      return null;
    }

    const trimmed = raw.trim();
    if (!trimmed || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
      return null;
    }

    return trimmed;
  }

  private resolveToastType(rawStatus: unknown, statusCode?: number, forceError = false): ToastType {
    if (forceError) {
      return "error";
    }

    if (typeof rawStatus === "string") {
      const normalizedStatus = rawStatus.trim().toLowerCase();

      if (["success", "ok", "completed", "positivo", "positiva", "esito positivo"].some((token) => normalizedStatus.includes(token))) {
        return "success";
      }

      if (["warning", "warn", "attenzione"].some((token) => normalizedStatus.includes(token))) {
        return "warning";
      }

      if (["error", "ko", "fail", "errore", "negativo", "esito negativo"].some((token) => normalizedStatus.includes(token))) {
        return "error";
      }
    }

    if (typeof rawStatus === "number") {
      return rawStatus >= 400 ? "error" : "success";
    }

    if (typeof statusCode === "number") {
      if (statusCode >= 500) {
        return "error";
      }

      if (statusCode >= 400) {
        return "warning";
      }

      if (statusCode >= 200 && statusCode < 300) {
        return "success";
      }
    }

    return "info";
  }
}
