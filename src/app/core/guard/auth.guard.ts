import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const utente = localStorage.getItem('utente') || sessionStorage.getItem('utente');
    if (utente) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}