import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { ImpiantoRoutingModule } from "./Impianto-routing.module";
import { ImpiantoComponent } from "../component/impianto/impianto.component";
import { DettaglioImpiantoComponent } from "../component/dettaglio-impianto/dettaglio-impianto.component";
import { InserimentoImpiantoComponent } from "../component/inserimento-impianto/inserimento-impianto.component";
import { ModificaImpiantoComponent } from "../component/modifica-impianto/modifica-impianto.component";

@NgModule({
  declarations: [ImpiantoComponent, DettaglioImpiantoComponent, InserimentoImpiantoComponent, ModificaImpiantoComponent],
  schemas: [],
  exports: [],
  imports: [SharedModule, ImpiantoRoutingModule],
})
export class ImpiantoModule {}
