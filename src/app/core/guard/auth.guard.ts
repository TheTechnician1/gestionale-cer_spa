import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { UtenteService } from "../services/utente.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: UtenteService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const isAuth = !!this.auth.currentUser;

    if (!isAuth) {
      return this.router.createUrlTree(["/login"], { queryParams: { returnUrl: state.url } });
    }

    const allowedRoles = route.data?.["role"] as string[] | undefined;
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const userRole = this.auth.getRole() as string | null;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return this.router.createUrlTree(["/not-authorized"]);
    }

    return true;
  }
}
