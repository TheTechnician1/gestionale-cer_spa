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
import { LoginComponent } from "./core/components/login/login/login.component";
import { RegistrazioneComponent } from "./core/components/login/registrazione/registrazione.component";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";

import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { A11yModule } from "@angular/cdk/a11y"; 
import { ListaProdottiComponent } from './core/components/lista-prodotti/lista-prodotti.component';
import { DettaglioProdottiComponent } from './core/components/dettaglio-prodotti/dettaglio-prodotti.component';
import { CartComponent } from './core/components/cart/cart.component';

@NgModule({
  declarations: [AppComponent, FullLayoutComponent, HeaderComponent, FooterComponent, SidebarComponent, RegistrazioneComponent, LoginComponent, ListaProdottiComponent, DettaglioProdottiComponent, CartComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, SharedModule, TranslateRootModule, CdkOverlayOrigin, A11yModule, MatButtonModule, MatToolbarModule],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpStatusInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
