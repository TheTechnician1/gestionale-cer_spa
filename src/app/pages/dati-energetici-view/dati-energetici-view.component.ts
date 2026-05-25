import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { DatiEnergeticiService } from 'src/app/components/services/dati-energetici.service';
import { DatiEnergeticiView } from 'src/app/core/interfaces/dati-energetici-view';

@Component({
  selector: 'app-dati-energetici-view',
  templateUrl: './dati-energetici-view.component.html',
  styleUrls: ['./dati-energetici-view.component.scss']
})
export class DatiEnergeticiViewComponent implements OnInit {

  dettaglio$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datiService: DatiEnergeticiService
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || isNaN(id)) {
      console.error('ID non valido');
      this.router.navigate(['/dati-energetici']);
      return;
    }

    this.dettaglio$ = this.datiService.getDatiById(id).pipe(
      map((res: any[]) => {

        console.log('RISPOSTA API:', res);

        if (!res || res.length === 0) {
          return null;
        }

        return res[0];
      })
    );
  }

  tornaIndietro(): void {
    this.router.navigate(['/dati-energetici']);
  }
}