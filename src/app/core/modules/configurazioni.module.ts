import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { ConfigurazioniRoutingModule } from "./configurazioni-routing.module";
import { ConfigurazioneComponent } from "../component/configurazione/configurazione.component";
import { DettaglioConfigurazioneComponent } from "../component/dettaglio-configurazione/dettaglio-configurazione.component";
import { InserimentoConfigurazioneComponent } from "../component/inserimento-configurazione/inserimento-configurazione.component";
import { ModificaConfigurazioneComponent } from "../component/modifica-configurazione/modifica-configurazione.component";

@NgModule({
  declarations: [ConfigurazioneComponent, DettaglioConfigurazioneComponent, InserimentoConfigurazioneComponent, ModificaConfigurazioneComponent],
  schemas: [],
  exports: [],
  imports: [SharedModule, ConfigurazioniRoutingModule],
})
export class ConfigurazioniModule {}
