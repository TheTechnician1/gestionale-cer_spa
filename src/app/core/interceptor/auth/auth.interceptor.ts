import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { StorageService } from "../../services/storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly tokenKey = "auth_token";

  constructor(private storage: StorageService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.storage.getLocal<string>(this.tokenKey) || this.storage.getSession<string>(this.tokenKey);

    if (!token) {
      return next.handle(req);
    }

    const authReq = req.clone({
      setHeaders: { Autorizzazione: `Bearer ${token}` },
    });

    return next.handle(authReq);
  }
}
