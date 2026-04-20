import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './core/interceptor/auth/auth.interceptor';
import { HttpStatusInterceptor } from './core/interceptor/http-status/http-status.interceptor';
import { GlobalErrorHandlerService } from './core/global-error-handler.service';
import { TranslateRootModule } from './core/translate/translate-root.module';
import { FullLayoutComponent } from './core/layout/full-layout.component';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LoginComponent } from './login/login.component';
import { RegistrazioneUtenteComponent } from './registrazione-utente/registrazione-utente.component';
import { HomeComponent } from './home/home.component';
import { FormRicercaCerComponent } from './form-ricerca-cer/form-ricerca-cer.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { TabellaCERComponent } from './tabella-cer/tabella-cer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    RegistrazioneUtenteComponent,
    HomeComponent,
    FormRicercaCerComponent,
    TabellaCERComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    TranslateRootModule,
    MatToolbarModule,
    MatSnackBarModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
  ],
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
