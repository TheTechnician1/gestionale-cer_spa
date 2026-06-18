import { Component } from '@angular/core';
import { OrdineService } from '../../services/ordine.service';
import { Ordine } from '../../interfaces/ordine';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-ordine',
  templateUrl: './ordine.component.html',
  styleUrls: ['./ordine.component.scss'],
})
export class OrdineComponent {
  ordine!: Ordine;
  loading = true;
  idOrdine!:number;

  constructor(
    private ordineService: OrdineService,
    private route:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idOrdine=Number(this.route.snapshot.paramMap.get('id'));
    this.recuperaOrdine(this.idOrdine);
  }

  recuperaOrdine(idOrdine: number |null): void {
    this.ordineService
      .visualizzaOrdine(idOrdine)
      .subscribe({
        next: (response: Ordine) => {
          this.ordine = response;
          this.loading = false;
        },
        error: (error) => {
          console.error(
            'Errore recupero ordine',
            error
          );
          this.loading = false;
        }
      });
  }



  formatPrice(value: number): string {
    return new Intl.NumberFormat(
      'it-IT',
      {
        style: 'currency',
        currency: 'EUR'
      }
    ).format(value);
  }
}
