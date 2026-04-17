import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { SHOW_ERROR_TOAST } from "../../services/api.service";
import { ToastService } from "../../services/toast.service";

@Injectable()
export class HttpStatusInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastService: ToastService,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const showToast = req.context.get(SHOW_ERROR_TOAST);
        if (showToast) {
          const message = this.getErrorMessage(error);
          this.toastService.show({ title: "Errore", message });
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

  private getErrorMessage(error: HttpErrorResponse): string {
    const backendMessage = (error.error && (error.error.message || error.error.msg || error.error.error)) || error.error || error.message || "Errore imprevisto";
    return typeof backendMessage === "string" ? backendMessage : "Errore imprevisto";
  }
}
