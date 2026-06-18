import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoggedInGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const utente = localStorage.getItem('utente') || sessionStorage.getItem('utente');
    if (utente) {
      this.router.navigate(['/prodotti']);
      return false;
    }
    return true;
  }
}