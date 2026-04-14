import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { FULL_LAYOUT_ROUTES } from "../../app.routes";
import { Observable } from "rxjs";
import { Role } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,

  ) {}
  canActivateError(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    throw new Error("Method not implemented.");
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    // Placeholder: replace with real auth flow.
    
    console.log("FACCIO LA MIA BELLA VERIFICA!");

    this.auth.isAuthenticated()
    const isAuth = this.auth.getIsAuthenticated().validUser
    const userRole = this.auth.getRole()
    
    if (this.auth.getIsAuthenticated().controllo) {
      return true;
    }

    console.log("NON E' autenticato");

    // 🚫 Non autenticato
    if(!isAuth){
      return this.router.createUrlTree(['/login']);
    }


    // 🎯 Ruoli richiesti dalla route
    const allowedRoles = route.data?.['roles'] as Role[];

    if (allowedRoles && !allowedRoles.includes(userRole!)) {
      return this.router.createUrlTree(['/unauthorized']);
    }
    
    return true;

    //return this.router.navigate("/login");
  }
}
