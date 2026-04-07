import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { FULL_LAYOUT_ROUTES } from "../../app.routes";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    throw new Error("Method not implemented.");
  }

  /* canActivate(): boolean | UrlTree {
    // Placeholder: replace with real auth flow.
    if (this.auth.isAuthenticated()) {
      return true;
    }

    return this.router.parseUrl(`/${FULL_LAYOUT_ROUTES.login}`);
  } */
}
