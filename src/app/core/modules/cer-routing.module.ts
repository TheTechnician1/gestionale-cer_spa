import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CER_ROUTES } from "../routes/cer.routes";

const routes: Routes = [
  {
    path: "",
    children: CER_ROUTES,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CerRoutingModule {}
