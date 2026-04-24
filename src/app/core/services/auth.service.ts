import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { FULL_LAYOUT_ROUTES } from '../../app.routes';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}
  canActivateError():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    throw new Error('Method not implemented.');
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const isPublic = !!route.data?.["public"];
    if (isPublic) {
      return true;
    }

    const user = this.loginService.currentUser;
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

    return this.router.parseUrl("/unauthorized");
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(route);
  }
}
