import { inject, Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class HttpStatusInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  private snackBar = inject(MatSnackBar);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackBar.open(
          'The status of the request is: ' + `${error.status} - ${error.error}`,
          'Close',
          {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          }
        );
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
