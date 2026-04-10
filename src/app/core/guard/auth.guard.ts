import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isPublic = !!route.data?.["public"];
    if (isPublic) {
      return true;
    }

    const user = this.auth.currentUser;
    if (!user) {
      return this.router.parseUrl("/login");
    }

    const allowedRoles = route.data?.["roles"] as string[] | undefined;
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    if (user.ruolo && allowedRoles.includes(user.ruolo)) {
      return true;
    }

    return this.router.parseUrl("/not-found");
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(route, state);
  }
}
