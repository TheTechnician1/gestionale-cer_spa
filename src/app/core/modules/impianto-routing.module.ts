import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IMPIANTO_ROUTES } from "../routes/impianto.routes";
import { ImpiantiRicercaComponent } from "src/app/components/impianti/impianti-ricerca/impianti-ricerca.component";
import { ImpiantiFormComponent } from "src/app/components/impianti/impianti-form/impianti-form.component";
import { ImpiantiViewComponent } from "src/app/components/impianti/impianti-view/impianti-view.component";

const routes: Routes = [

  {
    path: "",
    component: ImpiantiRicercaComponent
  },

  {
    path: "view/:id",
    component: ImpiantiViewComponent
  },

  {
    path: "edit/:id",
    component: ImpiantiFormComponent
  },

  {
    path: "form",
    component: ImpiantiFormComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImpiantoRoutingModule {}
