import { inject, Injectable } from "@angular/core";
import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

export const SILENT_HTTP_ERROR = new HttpContextToken<boolean>(() => false);

@Injectable()
export class HttpStatusInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  private snackBar = inject(MatSnackBar);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!req.context.get(SILENT_HTTP_ERROR)) {
          this.snackBar.open(
            this.formatErrorMessage(error),
            'Close',
            {
              duration: 4000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            }
          );
        }

        if (error.status === 401) {
          // Example: redirect to login
          this.router.navigateByUrl("/login");
        } else if (error.status === 403) {
          console.warn("Accesso negato (403).", error);
        } else if (error.status === 404) {
          console.warn("Risorsa non trovata (404).", error);
        } else if (error.status >= 500) {
          console.error("Errore server (5xx).", error);
        } else {
          console.error("Errore HTTP.", error);
        }

        return throwError(() => error);
      }),
    );
  }

  private formatErrorMessage(error: HttpErrorResponse): string {
    const dettaglio = this.extractErrorDetail(error.error);
    return dettaglio
      ? `Errore richiesta: ${error.status} - ${dettaglio}`
      : `Errore richiesta: ${error.status} - ${error.statusText || error.message}`;
  }

  private extractErrorDetail(error: unknown): string {
    if (!error) {
      return '';
    }

    if (typeof error === 'string') {
      return error;
    }

    if (typeof error === 'object') {
      const raw = error as Record<string, unknown>;
      const detail = raw['message'] ?? raw['error'] ?? raw['detail'] ?? raw['title'];

      if (typeof detail === 'string') {
        return detail;
      }

      try {
        return JSON.stringify(error);
      } catch {
        return '';
      }
    }

    return String(error);
  }
}
