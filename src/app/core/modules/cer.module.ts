import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CerRoutingModule } from "./cer-routing.module";
import { CERComponent } from "../component/cer/cer.component";
import { InserimentoCerComponent } from "../component/inserimento-cer/inserimento-cer.component";
import { DettaglioCerComponent } from "../component/dettaglio-cer/dettaglio-cer.component";
import { ModificaCerComponent } from "../component/modifica-cer/modifica-cer.component";

@NgModule({
  declarations: [CERComponent, InserimentoCerComponent, DettaglioCerComponent, ModificaCerComponent],
  schemas: [],
  exports: [],
  imports: [SharedModule, CerRoutingModule],
})
export class CerModule {}
