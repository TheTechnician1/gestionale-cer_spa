import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IMPIANTO_ROUTES } from "../routes/impianto.routes";
import { ImpiantiRicercaComponent } from "src/app/components/impianti/impianti-ricerca/impianti-ricerca.component";
import { ImpiantiFormComponent } from "src/app/components/impianti/impianti-form/impianti-form.component";
import { ImpiantiViewComponent } from "src/app/components/impianti/impianti-view/impianti-view.component";
import { AuthGuard } from "../guard/auth.guard";

const routes: Routes = [

  {
    path: "",
    component: ImpiantiRicercaComponent,
      data: { role: ["ADMIN", "GEST", "GUEST"] },
        canActivate: [AuthGuard] 
  },

  {
    path: "view/:id",
    component: ImpiantiViewComponent,
      data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard] 
  },

  {
    path: "edit/:id",
    component: ImpiantiFormComponent,
     data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard] 
  },

  {
    path: "form",
    component: ImpiantiFormComponent,
     data: { role: ["ADMIN"] },
    canActivate: [AuthGuard] 
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImpiantoRoutingModule {}
