import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { DatiEnergeticiRoutingModule } from "./dati-energetici-routing.module";
import { DettaglioDatiEnergeticiComponent } from "../component/dettaglio-dati-energetici/dettaglio-dati-energetici.component";
import { InserimentoDatiEnergeticiComponent } from "../component/inserimento-dati-energetici/inserimento-dati-energetici.component";
import { ModificaDatiEnergeticiComponent } from "../component/modifica-dati-energetici/modifica-dati-energetici.component";
import { DatiEnergeticiComponent } from "../component/dati-energetici/dati-energetici.component";

@NgModule({
  declarations: [DatiEnergeticiComponent, InserimentoDatiEnergeticiComponent, DettaglioDatiEnergeticiComponent, ModificaDatiEnergeticiComponent],
  schemas: [],
  exports: [],
  imports: [SharedModule, DatiEnergeticiRoutingModule],
})
export class DatiEnergeticiModule {}
