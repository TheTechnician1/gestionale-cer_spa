import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { DatiEnergeticiRoutingModule } from "./dati-energetici-routing.module";
import { DatiEnergeticiFormComponent } from "src/app/components/dati-energetici/dati-energetici-form/dati-energetici-form.component";
import { DatiEnergeticiRicercaComponent } from "src/app/components/dati-energetici/dati-energetici-ricerca/dati-energetici-ricerca.component";
@NgModule({
  declarations: [DatiEnergeticiRicercaComponent, DatiEnergeticiFormComponent],
  schemas: [],
  exports: [],
  imports: [SharedModule, DatiEnergeticiRoutingModule],
})
export class DatiEnergeticiModule {}
