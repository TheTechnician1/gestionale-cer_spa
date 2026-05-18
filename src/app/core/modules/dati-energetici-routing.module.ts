import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DatiEnergeticiRicercaComponent } from "src/app/components/dati-energetici/dati-energetici-ricerca/dati-energetici-ricerca.component";
import { DatiEnergeticiEditComponent } from "src/app/pages/dati-energetici-edit/dati-energetici-edit.component";

const routes: Routes = [
  {
    path: "",
    component: DatiEnergeticiRicercaComponent
  },
  {
    path: "edit/:id",
    component: DatiEnergeticiEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatiEnergeticiRoutingModule {}
