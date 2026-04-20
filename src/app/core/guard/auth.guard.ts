import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { FULL_LAYOUT_ROUTES } from "../../app.routes";
import { Observable } from "rxjs";
import { Role } from "../interfaces/ruolo.model";
import { Ruolo } from "../enum/role.enum";
import { UtenteService } from "../services/utente.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private auth: UtenteService, private router: Router) {}

  canActivateError(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    throw new Error("Method not implemented.");
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const isAuth = !!this.auth.currentUser;
    const userRole = this.auth.getRole();


    if(!isAuth){
      return this.router.createUrlTree(['/login']);
    }

    const allowedRoles = route.data?.['role'] as Ruolo[];

    if (allowedRoles && !allowedRoles.includes(userRole!)) {
      return this.router.createUrlTree(['/login']);
    }

    return true;
  }
}
