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
import { UtenteComponent } from './utente/utente.component';
import { ConfigurazioneComponent } from './core/component/configurazione/configurazione.component';
import { ImpiantoComponent } from './core/component/impianto/impianto.component';
import { CERComponent } from './core/component/cer/cer.component';
import { DatiEnergeticiComponent } from './core/component/dati-energetici/dati-energetici.component';

@NgModule({
  declarations: [AppComponent, FullLayoutComponent, HeaderComponent, FooterComponent, SidebarComponent, UtenteComponent, ConfigurazioneComponent, ImpiantoComponent, CERComponent, DatiEnergeticiComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, SharedModule, TranslateRootModule],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpStatusInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
