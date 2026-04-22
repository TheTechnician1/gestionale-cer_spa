import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CONFIGURAZIONE_ROUTES } from "../routes/configurazione.routes";

const routes: Routes = [
  {
    path: "",
    children: CONFIGURAZIONE_ROUTES,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurazioniRoutingModule {}
