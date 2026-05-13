import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { ImpiantoRoutingModule } from "./impianto-routing.module";
import { ImpiantiFormComponent } from "../../components/impianti/impianti-form/impianti-form.component";
import { ImpiantiRicercaComponent } from "../../components/impianti/impianti-ricerca/impianti-ricerca.component";

@NgModule({
  declarations: [ImpiantiRicercaComponent, ImpiantiFormComponent],
  schemas: [],
  exports: [],
  imports: [SharedModule, ImpiantoRoutingModule],
})
export class ImpiantoModule {}
