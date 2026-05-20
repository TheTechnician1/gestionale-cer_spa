import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DatiEnergeticiFormComponent } from "src/app/components/dati-energetici/dati-energetici-form/dati-energetici-form.component";

import { DatiEnergeticiRicercaComponent } from "src/app/components/dati-energetici/dati-energetici-ricerca/dati-energetici-ricerca.component";
import { DatiEnergeticiEditComponent } from "src/app/pages/dati-energetici-edit/dati-energetici-edit.component";
import { DatiEnergeticiViewComponent } from "src/app/pages/dati-energetici-view/dati-energetici-view.component";

const routes: Routes = [

  {
    path: "",
    component: DatiEnergeticiRicercaComponent
  },

  {
    path: "view/:id",
    component: DatiEnergeticiViewComponent
  },

  {
    path: "edit/:id",
    component: DatiEnergeticiEditComponent
  },

  {
    path: "form",
    component: DatiEnergeticiFormComponent
  }

];

@NgModule({ imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule], })
  export class DatiEnergeticiRoutingModule {}