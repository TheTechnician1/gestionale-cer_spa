import { NgModule, ErrorHandler } from "@angular/core";
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
import { RegistrazioneComponent } from "./components/auth/registrazione/registrazione.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { CerGestioneComponent } from "./components/comunita-energetica/cer-gestione/cer-gestione.component";
import { CerInserimentoComponent } from "./components/comunita-energetica/cer-inserimento/cer-inserimento.component";
import { CerModificaComponent } from "./components/comunita-energetica/cer-modifica/cer-modifica.component";
import { CerCancellazioneComponent } from "./components/comunita-energetica/cer-cancellazione/cer-cancellazione.component";
import { ConfigGestioneComponent } from "./components/configurazione/config-gestione/config-gestione.component";
import { ConfigInserimentoComponent } from "./components/configurazione/config-inserimento/config-inserimento.component";
import { ConfigModificaComponent } from "./components/configurazione/config-modifica/config-modifica.component";
import { ConfigCancellazioneComponent } from "./components/configurazione/config-cancellazione/config-cancellazione.component";
import { ImpiantoGestioneComponent } from "./components/impianto/impianto-gestione/impianto-gestione.component";
import { ImpiantoInserimentoComponent } from "./components/impianto/impianto-inserimento/impianto-inserimento.component";
import { ImpiantoModificaComponent } from "./components/impianto/impianto-modifica/impianto-modifica.component";
import { ImpiantoCancellazioneComponent } from "./components/impianto/impianto-cancellazione/impianto-cancellazione.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ToastComponent } from "./shared/components/toast/toast.component";
import { ToastHostComponent } from "./shared/components/toast-host/toast-host.component";

@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    RegistrazioneComponent,
    LoginComponent,
    CerGestioneComponent,
    CerInserimentoComponent,
    CerModificaComponent,
    CerCancellazioneComponent,
    ConfigGestioneComponent,
    ConfigInserimentoComponent,
    ConfigModificaComponent,
    ConfigCancellazioneComponent,
    ImpiantoGestioneComponent,
    ImpiantoInserimentoComponent,
    ImpiantoModificaComponent,
    ImpiantoCancellazioneComponent,
    DashboardComponent,
    NotFoundComponent,
    ToastComponent,
    ToastHostComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, SharedModule, TranslateRootModule],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpStatusInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
