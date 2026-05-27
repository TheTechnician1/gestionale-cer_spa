import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { UtenteService } from "../services/utente.service";
import { PermessiService } from "../services/permessi.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: UtenteService,
    private permessi: PermessiService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const isAuth = !!this.auth.currentUser;

    if (!isAuth) {
      return this.router.createUrlTree(["/login"], { queryParams: { returnUrl: state.url } });
    }

    const allowedRoles = route.data?.["role"] as string[] | undefined;
    // PermessiService.haUnoDei normalizza i nomi ruolo (ADM/ADMIN, GEST/GESTORE...).
    if (!this.permessi.haUnoDei(allowedRoles)) {
      return this.router.createUrlTree(["/not-authorized"]);
    }

    return true;
  }
}
