import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { FullLayoutComponent } from "./core/layout/full-layout.component";
import { LoginComponent } from "./core/components/login/login/login.component";
import { FULL_LAYOUT_ROUTES } from "./app.routes";
import { DatiEnergeticiFormComponent } from "./components/dati-energetici/dati-energetici-form/dati-energetici-form.component";

const routes: Routes = [

  {
    path: "",
    component: FullLayoutComponent,
    children: [
      ...FULL_LAYOUT_ROUTES
    ]
  },

  {
    path: "dati-energetici",
    loadChildren: () =>
      import("./core/modules/dati-energetici.module")
        .then(m => m.DatiEnergeticiModule)
  },

  {
    path: "login",
    component: LoginComponent
  },

  {
    path: "**",
    redirectTo: "login"
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}