import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../core/services/login.service';
import { CerElemento, FiltroService } from '../core/services/filtro.service';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-tabella-cer',
  templateUrl: './tabella-cer.component.html',
  styleUrls: ['./tabella-cer.component.scss'],
})
export class TabellaCERComponent implements AfterViewInit, OnChanges {
  private readonly displayedColumnsConStato: string[] = [
    'ragioneSociale',
    'partitaIVA',
    'formaGiuridica',
    'stato',
    'azioni',
  ];

  private readonly displayedColumnsSenzaStato: string[] = [
    'ragioneSociale',
    'partitaIVA',
    'formaGiuridica',
    'azioni',
  ];

  private filtroService = inject(FiltroService);

  @Input() risultatiFiltrati: CerElemento[] = this.filtroService.getListaElementi();

  dataSource = new MatTableDataSource<CerElemento>(this.risultatiFiltrati);

  constructor(private login: LoginService) {}
  // simone?: number
  // id = this.log.getid()
  // ruolo: string = ''

  getRuolo(): string {
    let ruolo = this.login.currentUser?.ruolo;
    console.log(ruolo);
    return ruolo!;
  }

  isAdmin(): boolean {
    return this.login.isGranted() === 'ADMIN';
  }

  get displayedColumns(): string[] {
    return this.isAdmin()
      ? this.displayedColumnsConStato
      : this.displayedColumnsSenzaStato;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['risultatiFiltrati']) {
      this.dataSource.data = this.risultatiFiltrati;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface AnagraficaCER {
  id: number;
  ragioneSociale: string;
  p_iva: string;
  codiceFiscale: string;
  formaGiuridica: string;
  stato: string;
  indirizzo: string;
  comune: string;
  provincia: string;
  regione: string;
  cap: string;
  email: string;
  pec: string;
  sitoWeb: string;
  telefono: string;
  referente: string;
  specificheFormaGiuridica: string;
  noteGestionali: string;
  impianti: ImpiantoCER[];
  azioni: any;
}

export interface ImpiantoCER {
  id: number;
  nome: string;
  tipologia: string;
  potenza: string;
  comune: string;
  stato: string;
  dataAttivazione: string;
  indirizzo: string;
}

export const ELEMENT_DATA: AnagraficaCER[] = [
  {
    id: 1,
    ragioneSociale: 'CER Valle Verde',
    p_iva: '04251860961',
    codiceFiscale: '97845230152',
    formaGiuridica: 'Associazione riconosciuta',
    stato: 'Attiva',
    indirizzo: 'Via delle Energie 14',
    comune: 'Milano',
    provincia: 'MI',
    regione: 'Lombardia',
    cap: '20124',
    email: 'segreteria@cervalleverde.it',
    pec: 'cervalleverde@pec.it',
    sitoWeb: 'https://www.cervalleverde.it',
    telefono: '+39 02 4455667',
    referente: 'Laura Conti',
    specificheFormaGiuridica: 'Associazione riconosciuta con personalita giuridica iscritta al registro regionale.',
    noteGestionali: 'CER in esercizio con convenzione GSE attiva e monitoraggio mensile dei flussi energetici.',
    impianti: [
      {
        id: 101,
        nome: 'Fotovoltaico scuola primaria',
        tipologia: 'Fotovoltaico',
        potenza: '120 kW',
        comune: 'Milano',
        stato: 'In esercizio',
        dataAttivazione: '01/07/2024',
        indirizzo: 'Via Manzoni 18',
      },
      {
        id: 102,
        nome: 'Pensiline centro sportivo',
        tipologia: 'Fotovoltaico su pensilina',
        potenza: '85 kW',
        comune: 'Sesto San Giovanni',
        stato: 'In collaudo',
        dataAttivazione: '10/02/2026',
        indirizzo: 'Via dello Sport 3',
      },
    ],
    azioni: '',
  },
  {
    id: 2,
    ragioneSociale: 'Comunita Solare Nord',
    p_iva: '03124890127',
    codiceFiscale: '96321580488',
    formaGiuridica: 'Cooperativa',
    stato: 'In istruttoria',
    indirizzo: 'Piazza Europa 5',
    comune: 'Varese',
    provincia: 'VA',
    regione: 'Lombardia',
    cap: '21100',
    email: 'info@comunitasolare-nord.it',
    pec: 'comunitasolare-nord@pec.it',
    sitoWeb: 'https://www.comunitasolare-nord.it',
    telefono: '+39 0332 778899',
    referente: 'Marco Bianchi',
    specificheFormaGiuridica: 'Cooperativa a mutualita prevalente con soci produttori e consumatori.',
    noteGestionali: 'Documentazione tecnica in verifica; completamento previsto entro il prossimo aggiornamento anagrafico.',
    impianti: [
      {
        id: 201,
        nome: 'Copertura municipio',
        tipologia: 'Fotovoltaico',
        potenza: '64 kW',
        comune: 'Varese',
        stato: 'Progettazione',
        dataAttivazione: 'Prevista 30/09/2026',
        indirizzo: 'Piazza Monte Grappa 1',
      },
    ],
    azioni: '',
  },
  {
    id: 3,
    ragioneSociale: 'CER Energia Brianza',
    p_iva: '11987450968',
    codiceFiscale: '94058720158',
    formaGiuridica: 'Fondazione di partecipazione',
    stato: 'Attiva',
    indirizzo: 'Corso Liberta 22',
    comune: 'Monza',
    provincia: 'MB',
    regione: 'Lombardia',
    cap: '20900',
    email: 'amministrazione@cerbrianza.it',
    pec: 'cerbrianza@pec.it',
    sitoWeb: 'https://www.cerbrianza.it',
    telefono: '+39 039 221144',
    referente: 'Giulia Ferri',
    specificheFormaGiuridica: 'Fondazione di partecipazione con enti locali e soggetti privati aderenti.',
    noteGestionali: 'Include utenze comunali e PMI locali; ultima rendicontazione validata.',
    impianti: [
      {
        id: 301,
        nome: 'Impianto biblioteca civica',
        tipologia: 'Fotovoltaico',
        potenza: '48 kW',
        comune: 'Monza',
        stato: 'In esercizio',
        dataAttivazione: '18/09/2024',
        indirizzo: 'Via Italia 27',
      },
      {
        id: 302,
        nome: 'Mini eolico area industriale',
        tipologia: 'Mini eolico',
        potenza: '30 kW',
        comune: 'Lissone',
        stato: 'In esercizio',
        dataAttivazione: '12/01/2025',
        indirizzo: "Via dell'Industria 9",
      },
    ],
    azioni: '',
  },
  {
    id: 4,
    ragioneSociale: 'CER Lago Pulito',
    p_iva: '02745140135',
    codiceFiscale: '91026430139',
    formaGiuridica: 'Associazione',
    stato: 'Sospesa',
    indirizzo: 'Lungolago Trento 8',
    comune: 'Como',
    provincia: 'CO',
    regione: 'Lombardia',
    cap: '22100',
    email: 'contatti@cerlagopulito.it',
    pec: 'cerlagopulito@pec.it',
    sitoWeb: 'https://www.cerlagopulito.it',
    telefono: '+39 031 556677',
    referente: 'Paolo Ricci',
    specificheFormaGiuridica: 'Associazione non riconosciuta con regolamento interno per la gestione dei membri.',
    noteGestionali: 'Sospensione temporanea per aggiornamento configurazione impianti e POD associati.',
    impianti: [
      {
        id: 401,
        nome: 'Tetto palazzetto comunale',
        tipologia: 'Fotovoltaico',
        potenza: '75 kW',
        comune: 'Como',
        stato: 'Manutenzione',
        dataAttivazione: '06/05/2023',
        indirizzo: 'Via Castelnuovo 2',
      },
    ],
    azioni: '',
  },
  {
    id: 5,
    ragioneSociale: 'Rete Energia Sud Milano',
    p_iva: '06789120963',
    codiceFiscale: '97531040154',
    formaGiuridica: 'Consorzio',
    stato: 'Attiva',
    indirizzo: 'Via Roma 44',
    comune: 'Rozzano',
    provincia: 'MI',
    regione: 'Lombardia',
    cap: '20089',
    email: 'gestione@reteenergiasud.it',
    pec: 'reteenergiasud@pec.it',
    sitoWeb: 'https://www.reteenergiasud.it',
    telefono: '+39 02 9988776',
    referente: 'Elena Sala',
    specificheFormaGiuridica: 'Consorzio tra enti, imprese e cittadini per la condivisione dell energia prodotta.',
    noteGestionali: 'Configurazione multi-impianto con utenze residenziali e terziarie.',
    impianti: [
      {
        id: 501,
        nome: 'Parcheggio interscambio',
        tipologia: 'Fotovoltaico su pensilina',
        potenza: '140 kW',
        comune: 'Rozzano',
        stato: 'In esercizio',
        dataAttivazione: '25/03/2025',
        indirizzo: 'Via Curiel 12',
      },
      {
        id: 502,
        nome: 'Centro civico',
        tipologia: 'Fotovoltaico',
        potenza: '52 kW',
        comune: 'Opera',
        stato: 'In esercizio',
        dataAttivazione: '03/06/2025',
        indirizzo: 'Via Dante 6',
      },
    ],
    azioni: '',
  },
];
