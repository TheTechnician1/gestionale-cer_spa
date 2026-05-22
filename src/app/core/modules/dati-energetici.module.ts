import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatiEnergeticiRoutingModule } from './dati-energetici-routing.module';
import { DatiEnergeticiFormComponent } from 'src/app/components/dati-energetici/dati-energetici-form/dati-energetici-form.component';
import { DatiEnergeticiRicercaComponent } from 'src/app/components/dati-energetici/dati-energetici-ricerca/dati-energetici-ricerca.component';

@NgModule({
  declarations: [DatiEnergeticiRicercaComponent, DatiEnergeticiFormComponent],
  schemas: [],
  exports: [],
  imports: [SharedModule, DatiEnergeticiRoutingModule],
})
export class DatiEnergeticiModule {}

export interface DatiEnergetici {
  idDati: number | null;
  idCer: number | null;
  idConfig: number | null;
  anno: string | null;
  eProdotta: number | null;
  ePrelevata: number | null;
  eImmessa: number | null;
  eCondivisa: number | null;
  eAutoCons: number | null;
  energiaProdotta: number | null;
  energiaPrelevata: number | null;
  energiaImmessa: number | null;
  energiaCondivisa: number | null;
  energiaAutoCons: number | null;
  tariffaPremium: number | null;
  corrPremioOtt: number | null;
  ridEmCo2: string | null;
  statoScheda: string | null;
  flgCancellazione: string | null;
  emailUtenteLoggato: string | null;
}
