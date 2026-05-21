import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { ImpiantoRoutingModule } from "./impianto-routing.module";
import { ImpiantiFormComponent } from "../../components/impianti/impianti-form/impianti-form.component";
import { ImpiantiRicercaComponent } from "../../components/impianti/impianti-ricerca/impianti-ricerca.component";
import { ImpiantiModificaComponent } from "src/app/components/impianti/impianto-modifica/impianto-modifica.component";

@NgModule({
  declarations: [ImpiantiRicercaComponent, ImpiantiFormComponent,ImpiantiModificaComponent],
  schemas: [],
  exports: [],
  imports: [SharedModule, ImpiantoRoutingModule],
})
export class ImpiantoModule {}
