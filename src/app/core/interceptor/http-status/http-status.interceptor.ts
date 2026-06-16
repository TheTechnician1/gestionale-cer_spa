import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, catchError, tap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { ToastService } from "../../services/toast.service";
import { SKIP_HTTP_SNACKBAR } from "./http-snackbar.context";

@Injectable()
export class HttpStatusInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastService: ToastService,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const skipToast = req.context.get(SKIP_HTTP_SNACKBAR);

    return next.handle(req).pipe(
      tap((event) => {
        if (skipToast || !(event instanceof HttpResponse)) {
          return;
        }

        this.toastService.showFromHttpSuccess(req, event);
      }),
      catchError((error: HttpErrorResponse) => {
        if (!skipToast) {
          this.toastService.showFromHttpError(req, error);
        }

        if (error.status === 401) {
          this.router.navigateByUrl("/login");
        } else if (error.status === 403) {
          // this.router.navigateByUrl("/not-authorized");
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
