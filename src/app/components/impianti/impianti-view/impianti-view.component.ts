import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ImpiantoById } from 'src/app/core/interfaces/impianto.model';
import { ImpiantoService } from '../../services/impianto.service';

@Component({
  selector: 'app-impianti-view',
  templateUrl: './impianti-view.component.html',
  styleUrls: ['./impianti-view.component.scss']
})
export class ImpiantiViewComponent {

  impianto$?: Observable<ImpiantoById>;
  idImpianto?: number;

  constructor(private route: ActivatedRoute, private router: Router, private impiantoService: ImpiantoService) {}

  ngOnInit(): void {
    this.idImpianto = Number(this.route.snapshot.paramMap.get('id'));
    if(!this.idImpianto){
      alert("Impianto non trovato");
      this.router.navigate(['/impianto']);
    } else {
      this.impianto$ = this.impiantoService.getImpiantoById(this.idImpianto);
      this.impianto$.subscribe({
        error: (err) => {
          alert("Impianto non trovato");
          this.router.navigate(['/impianto']);
        }
      });
    }
  }

  tornaIndietro(): void {
    this.router.navigate(['/impianto']);
  }

}
