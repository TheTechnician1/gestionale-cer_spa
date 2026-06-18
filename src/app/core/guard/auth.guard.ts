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
      return this.router.createUrlTree([""], { queryParams: { returnUrl: state.url } });
    }
    
    return true;
  }
}
