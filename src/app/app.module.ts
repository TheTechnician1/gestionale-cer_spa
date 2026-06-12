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
import { UtenteComponent } from "./core/components/utente/utente.component";
import { LoginComponent } from "./core/components/login/login/login.component";
import { RegistrazioneUtenteComponent } from "./core/components/login/registrazione-utente/registrazione-utente.component";
import { NotAuthorizedComponent } from "./core/components/not-authorized/not-authorized.component";

import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { A11yModule } from "@angular/cdk/a11y";
import { SellerComponent } from './core/components/seller/seller.component';
import { CartComponent } from './core/components/cart/cart.component';
import { OrderComponent } from './core/components/order/order.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { ProductComponent } from './core/components/product/product.component';
import { OfferteComponent } from './core/components/offerte/offerte.component';
import { SearchComponent } from './core/components/search/search.component';

@NgModule({
  declarations: [AppComponent, FullLayoutComponent, HeaderComponent, FooterComponent, UtenteComponent, RegistrazioneUtenteComponent, LoginComponent, NotAuthorizedComponent, SellerComponent, CartComponent, OrderComponent, DashboardComponent, ProductComponent, OfferteComponent, SearchComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, SharedModule, TranslateRootModule, CdkOverlayOrigin, A11yModule],
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
