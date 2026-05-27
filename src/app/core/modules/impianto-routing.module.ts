import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ImpiantiRicercaComponent } from "../../components/impianti/impianti-ricerca/impianti-ricerca.component";
import { ImpiantiFormComponent } from "../../components/impianti/impianti-form/impianti-form.component";
import { ImpiantiModificaComponent } from "src/app/components/impianti/impianto-modifica/impianto-modifica.component";
import { AuthGuard } from "../guard/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: ImpiantiRicercaComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "inserimento-impianto",
    component: ImpiantiFormComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "modifica-impianto/:id",
    component: ImpiantiModificaComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard],
  },
  {
    path: "dettaglio-impianto/:id",
    component: ImpiantiModificaComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImpiantoRoutingModule {}