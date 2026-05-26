import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DatiEnergeticiFormComponent } from "src/app/components/dati-energetici/dati-energetici-form/dati-energetici-form.component";

import { DatiEnergeticiRicercaComponent } from "src/app/components/dati-energetici/dati-energetici-ricerca/dati-energetici-ricerca.component";
import { DatiEnergeticiEditComponent } from "src/app/pages/dati-energetici-edit/dati-energetici-edit.component";
import { DatiEnergeticiViewComponent } from "src/app/pages/dati-energetici-view/dati-energetici-view.component";
import { AuthGuard } from "../guard/auth.guard";

const routes: Routes = [

  {
    path: "",
    component: DatiEnergeticiRicercaComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard] 
  },

  {
    path: "view/:id",
    component: DatiEnergeticiViewComponent,
    data: { role: ["ADMIN", "GEST", "GUEST"] },
    canActivate: [AuthGuard] 
  },

  {
    path: "edit/:id",
    component: DatiEnergeticiEditComponent,
    data: { role: ["ADMIN", "GEST"] },
    canActivate: [AuthGuard] 
  },

  {
    path: "form",
    component: DatiEnergeticiFormComponent,
        data: { role: ["ADMIN"] },
    canActivate: [AuthGuard] 
  }

];

@NgModule({ imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule], })
  export class DatiEnergeticiRoutingModule {}