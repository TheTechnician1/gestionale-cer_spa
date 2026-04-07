import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class HttpStatusInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
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
}
