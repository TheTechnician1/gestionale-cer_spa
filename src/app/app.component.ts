import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UtenteService } from "./core/services/utente.service";
import { NavigationEnd, Router } from "@angular/router";
import { filter, first } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: UtenteService,
  ) {
    this.translate.setDefaultLang("en");
    this.translate.use("en");
  }
  showSplash = true;
  private splashShownKey = 'splashShown';
  private splashClosed = false;

  ngOnInit(): void {
    const shown = sessionStorage.getItem(this.splashShownKey);
    if(shown) { this.showSplash = false; return; }

    this.router.events.pipe(filter(e => e instanceof NavigationEnd), first()).subscribe(() => this.hideSplash());
    this.authService.user$.pipe(first()).subscribe(() => this.hideSplash());
    setTimeout(() => { if (this.showSplash) this.hideSplash(); }, 5000);
  }

  onSplashFinished(): void {
    this.hideSplash();
  }

  private hideSplash(): void {
    if(this.splashClosed) return;
    this.splashClosed = true;
    this.showSplash = false;
    sessionStorage.setItem(this.splashShownKey, '1');
  }
}
