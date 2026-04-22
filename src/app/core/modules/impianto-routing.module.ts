import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IMPIANTO_ROUTES } from "../routes/impianto.routes";

const routes: Routes = [
  {
    path: "",
    children: IMPIANTO_ROUTES,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImpiantoRoutingModule {}
