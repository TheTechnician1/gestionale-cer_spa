import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { UtenteService } from "../services/utente.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private auth: UtenteService, private router: Router) {}
  private GUEST_EMAIL = 'guest@guest.guest';

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const user = this.auth.currentUser;


    const isLogged = !!user;
    const isGuest = user?.email === this.GUEST_EMAIL;
    const isAuth = isLogged && !isGuest;

    if (!isAuth) {
      return this.router.createUrlTree(["/login"], { queryParams: { returnUrl: state.url } });
    }

    return true;
  }
}
