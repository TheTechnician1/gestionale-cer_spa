import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean | UrlTree {
    
    const user = this.authService.currentUser;

    if (!user) {
      return this.router.createUrlTree(["/login"]);
    }
    
    return true;
  }
}
