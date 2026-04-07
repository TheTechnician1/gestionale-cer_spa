import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private zone: NgZone) {
    window.addEventListener("unhandledrejection", (event) => {
      this.handleError(event.reason ?? "Unhandled Promise rejection");
    });

    window.addEventListener("error", (event) => {
      this.handleError(event.error ?? event.message);
    });
  }

  handleError(error: unknown): void {
    this.zone.run(() => {
      const normalized = this.normalizeError(error);
      console.error("%c[GlobalErrorHandler]", "color: red; font-weight: bold;", normalized.message, "\nContext:", normalized.context, "\nStack:", normalized.stack);
    });
  }

  private normalizeError(error: unknown): { message: string; stack?: string; context?: unknown } {
    if (error instanceof HttpErrorResponse) {
      return {
        message: navigator.onLine ? `HTTP error: Status ${error.status} - ${error.message}` : "No Internet Connection",
        stack: error.error?.stack,
        context: error.error,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message || "Unknown error",
        stack: error.stack,
      };
    }

    if (typeof error === "string") {
      return { message: error };
    }

    return {
      message: "Unknown error",
      context: error,
    };
  }
}
