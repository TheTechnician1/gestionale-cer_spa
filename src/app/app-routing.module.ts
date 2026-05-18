import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FullLayoutComponent } from "./core/layout/full-layout.component";
import { LoginComponent } from "./core/components/login/login/login.component";
import { FULL_LAYOUT_ROUTES } from "./app.routes";

const routes: Routes = [
  {
    path: "",
    component: FullLayoutComponent,
    children: FULL_LAYOUT_ROUTES
  },
  {
    path: "login",
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}