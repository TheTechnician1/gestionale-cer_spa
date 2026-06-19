import { Component } from '@angular/core';
import { OrdineService } from '../../services/ordine.service';
import { Ordine } from '../../interfaces/ordine';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from "@angular/material/card";
import { ToastService } from '../../services/toast.service';

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
    private route:ActivatedRoute,
    private toast:ToastService
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
          this.toast.error("Errore recupero ordine")
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

  invioRicevuta(){
    this.toast.info("Invio ricevuta in corso")
    this.ordineService.invioRicevuta(this.idOrdine);
  }
}
