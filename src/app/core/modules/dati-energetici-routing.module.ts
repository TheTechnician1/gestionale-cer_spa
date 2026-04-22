import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DATI_ENERGETICI_ROUTES } from "../routes/dati-energetici.routes";

const routes: Routes = [
  {
    path: "",
    children: DATI_ENERGETICI_ROUTES,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatiEnergeticiRoutingModule {}
