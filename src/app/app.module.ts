import { NgModule, ErrorHandler, Component } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { AuthInterceptor } from "./core/interceptor/auth/auth.interceptor";
import { HttpStatusInterceptor } from "./core/interceptor/http-status/http-status.interceptor";
import { GlobalErrorHandlerService } from "./core/global-error-handler.service";
import { TranslateRootModule } from "./core/translate/translate-root.module";
import { FullLayoutComponent } from "./core/layout/full-layout.component";
import { HeaderComponent } from "./core/layout/header/header.component";
import { FooterComponent } from "./core/layout/footer/footer.component";
import { SidebarComponent } from "./core/layout/sidebar/sidebar.component";
import { UtenteComponent } from './core/component/utente/utente.component';
import { ConfigurazioneComponent } from './core/component/configurazione/configurazione.component';
import { ImpiantoComponent } from './core/component/impianto/impianto.component';
import { CERComponent } from './core/component/cer/cer.component';
import { DatiEnergeticiComponent } from './core/component/dati-energetici/dati-energetici.component';
import { RegistrazioneUtenteComponent } from './core/component/login/registrazione-utente/registrazione-utente.component';
import { LoginComponent } from './core/component/login/login/login.component';
import { DettaglioCerComponent } from './core/component/dettaglio-cer/dettaglio-cer.component';
import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { A11yModule } from "@angular/cdk/a11y";
import { DashboardComponent } from './core/component/dashboard/dashboard.component';
import { ModificaCerComponent } from './core/component/modifica-cer/modifica-cer.component';
import { InserimentoCerComponent } from './core/component/inserimento-cer/inserimento-cer.component';
import { InserimentoImpiantoComponent } from './core/component/inserimento-impianto/inserimento-impianto.component';
import { InserimentoDatiEnergeticiComponent } from './core/component/inserimento-dati-energetici/inserimento-dati-energetici.component';
import { InserimentoConfigurazioneComponent } from './core/component/inserimento-configurazione/inserimento-configurazione.component';
import { ModificaConfigurazioneComponent } from './core/component/modifica-configurazione/modifica-configurazione.component';
import { ModificaImpiantoComponent } from './core/component/modifica-impianto/modifica-impianto.component';
import { ModificaDatiEnergeticiComponent } from './core/component/modifica-dati-energetici/modifica-dati-energetici.component';
import { DettaglioConfigurazioneComponent } from './core/component/dettaglio-configurazione/dettaglio-configurazione.component';
import { DettaglioImpiantoComponent } from './core/component/dettaglio-impianto/dettaglio-impianto.component';
import { DettaglioDatiEnergeticiComponent } from './core/component/dettaglio-dati-energetici/dettaglio-dati-energetici.component';
import { NotAuthorizedComponent } from './core/component/not-authorized/not-authorized.component';


@NgModule({
  declarations: [AppComponent, FullLayoutComponent, HeaderComponent, FooterComponent, SidebarComponent, UtenteComponent, ConfigurazioneComponent, ImpiantoComponent, CERComponent, DatiEnergeticiComponent, RegistrazioneUtenteComponent, LoginComponent, DettaglioCerComponent, DashboardComponent, ModificaCerComponent, InserimentoCerComponent, InserimentoImpiantoComponent, InserimentoDatiEnergeticiComponent, InserimentoConfigurazioneComponent, ModificaConfigurazioneComponent, ModificaImpiantoComponent, ModificaDatiEnergeticiComponent, DettaglioConfigurazioneComponent, DettaglioImpiantoComponent, DettaglioDatiEnergeticiComponent, NotAuthorizedComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, SharedModule, TranslateRootModule, CdkOverlayOrigin, A11yModule],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpStatusInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
