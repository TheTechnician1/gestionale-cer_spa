import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  AnagraficaCER,
  ELEMENT_DATA,
  ImpiantoCER,
} from '../tabella-cer/tabella-cer.component';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-dettagli-tabella-cer',
  templateUrl: './dettagli-tabella-cer.component.html',
  styleUrls: ['./dettagli-tabella-cer.component.scss'],
})
export class DettagliTabellaCerComponent implements OnInit {
  cer?: AnagraficaCER;
  impiantoSelezionato?: ImpiantoCER;
  displayedColumns: string[] = [
    'nome',
    'tipologia',
    'potenza',
    'comune',
    'stato',
    'azioni',
  ];

  constructor(
    private route: ActivatedRoute,
    private login: LoginService,
    private dialog: MatDialog
  ) {}

  isAdmin(): boolean {
    return this.login.isGranted() === 'ADMIN';
  }

  apriDettaglioImpianto(
    impianto: ImpiantoCER,
    dettaglioImpiantoDialog: TemplateRef<unknown>
  ): void {
    this.impiantoSelezionato = impianto;
    this.dialog.open(dettaglioImpiantoDialog, {
      width: '720px',
      maxWidth: '95vw',
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const cerId = Number(params.get('id'));
      const impiantoId = Number(params.get('impiantoId'));

      this.cer = ELEMENT_DATA.find((elemento) => elemento.id === cerId);
      this.impiantoSelezionato = this.cer?.impianti.find(
        (impianto) => impianto.id === impiantoId
      );
    });
  }
}
