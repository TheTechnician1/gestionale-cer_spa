import { Component, EventEmitter, Output } from "@angular/core";
import { UtenteService } from "../../services/utente.service";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map, Observable, startWith } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  idUtente?: number | null;
    isLoggedIn$: Observable<boolean>;

  ngOnInit() {} 

 searchText: string = '';

  isProdottiPage$: Observable<boolean>;
  constructor(private authService: UtenteService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isProdottiPage$ = this.router.events.pipe(
      filter((event): event is NavigationEnd =>
        event instanceof NavigationEnd
      ),
      map(event => event.urlAfterRedirects === '/prodotti' || event.urlAfterRedirects.startsWith('/ricerca-prodotti')),
      startWith(this.router.url === '/prodotti' || this.router.url.startsWith('/ricerca-prodotti'))
    );
  }

  onSearchChange() {
    this.router.navigate(['/ricerca-prodotti', this.searchText]);
    this.searchText="";
  }

  toHome() {
    this.router.navigate(['/ricerca-prodotti', ""]);
  }

  logout() {
    this.authService.logout();
  }

  toCarrello(){
    this.router.navigate(['/carrello', this.authService.currentUser?.id]);
  }
}
