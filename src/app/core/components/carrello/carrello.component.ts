import { Component, OnInit } from '@angular/core';
import { ArticoloCarrelloDTO, Carrello, ViewArticoloCarrelloDTO } from '../../interfaces/carrello';
import { CarrelloService } from '../../services/carrello.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { OrdineService } from '../../services/ordine.service';


@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.scss']
})
export class CarrelloComponent implements OnInit {

  idUtente?: number;
  carrello!: Carrello;
  formAggiunta!: FormGroup
  flagCheckout : boolean = true;


  constructor(private carrelloService: CarrelloService, 
    private ordineService : OrdineService,
    private route: ActivatedRoute,
    private router : Router,
    private toast: ToastService,
    private fb:FormBuilder){
      this.formAggiunta= this.fb.group({
        quantita:[null,[Validators.required, Validators.min(1)]]
      });

      this.formAggiunta.get('quantita')?.markAsTouched();
    }

  ngOnInit(): void {
    
    this.idUtente = Number(this.route.snapshot.paramMap.get('id'));
    this.carrelloService.getCarrello(this.idUtente).subscribe({
      next: (carrello) => {
        this.carrello = carrello;

        this.carrelloService.checkSaldo(
          this.idUtente!,
          this.totaleCarrello
        ).subscribe({
          next: (flag) => {
            this.flagCheckout = flag;
            console.log(flag);
          },
          error: (err) => {
            this.flagCheckout = true;
            console.error(err);
          }
        });
      }
    });
  }


get totaleCarrello(): number {
  if (!this.carrello?.articoli) return 0;
  for (const articolo of this.carrello.articoli) {
    if (
      articolo.quantita > articolo.prodotto.quantitaDisponibile ||
      articolo.quantita <= 0
    ) {
      return 0;
    }
  }
  return this.carrello.articoli.reduce(
    (tot: number, a: ViewArticoloCarrelloDTO) =>
      tot + (a.prezzo * a.quantita),
    0
  );
}

  get totaleArticoli(): number {
    for(const articolo of this.carrello.articoli){
      if(articolo.quantita>articolo.prodotto.quantitaDisponibile ||
        articolo.quantita<=0 || !this.flagCheckout)
        return 0;
    }
    return this.carrello.articoli
      .reduce(
        (tot: number, a: ViewArticoloCarrelloDTO) => tot + a.quantita,
        0
      );
  }

  aggiornaQuantita(
    articolo: ViewArticoloCarrelloDTO
  ){
    if(this.formAggiunta.valid){
      this.carrelloService.aggiornaArticoloCarrello(this.idUtente, 
        articolo.idArticoloCarrello,
        this.mapToArticoloCarrelloDTO(articolo)
      ).subscribe({
        next: (carrello: Carrello) => {
          this.carrello = carrello;
          this.carrelloService.checkSaldo(
            this.idUtente!,
            this.totaleCarrello
          ).subscribe({
            next: (flag) => {
              this.flagCheckout = flag;
              console.log(flag);
            },
            error: (err) => {
              this.flagCheckout = true;
              console.error(err);
            }
          });
          this.toast.success('Quantità articolo aggiornata');
        },
        error: (err) => {
          console.error('Errore rimozione articolo', err);
          this.toast.error('Errore aggiornamento articolo');
        }
      });
    }
  }

  rimuovi(
    articolo: ViewArticoloCarrelloDTO
  ){
    this.carrelloService.cancellaArticoloCarrello(this.idUtente, articolo.idArticoloCarrello).subscribe({
      next: () => {
        this.carrello.articoli = this.carrello.articoli.filter(a => a.idArticoloCarrello !== articolo.idArticoloCarrello);
        this.carrelloService.checkSaldo(
          this.idUtente!,
          this.totaleCarrello
        ).subscribe({
          next: (flag) => {
            this.flagCheckout = flag;
            console.log(flag);
          },
          error: (err) => {
            this.flagCheckout = true;
            console.error(err);
          }
        });

        this.toast.success('Articolo rimosso dal carrello');
      },
      error: (err) => {
        console.error('Errore rimozione articolo', err);
        this.toast.error('Errore rimozione articolo');
      }
    });
  }
  
  creaOrdine(){
    
    forkJoin({
      ordine:this.ordineService.creaOrdine(this.idUtente,   
        this.mapToListArticoloCarrelloDTO(this.carrello.articoli)
      )
    }).subscribe({
      next:({ordine})=>{
        this.toast.success("ordine creato");
        this.router.navigate(["/ordine", ordine.id]);
      },
      error: (err) => {
        console.error('Errore creazione ordine', err);
        this.toast.error('Errore creazione ordine');
      }

    });
  }

  mapToArticoloCarrelloDTO(
    articolo: ViewArticoloCarrelloDTO
  ): ArticoloCarrelloDTO {
    return {
      id: articolo.idArticoloCarrello,
      quantita: articolo.quantita,
      prezzoUnitario: articolo.prezzo,
      idCarrello: articolo.idCarrello,
      idProdotto: articolo.idProdotto
    };
  }
  mapToListArticoloCarrelloDTO(
    articoli: ViewArticoloCarrelloDTO[]
  ): ArticoloCarrelloDTO[]{
    return articoli.map(a=>this.mapToArticoloCarrelloDTO(a));
  }

  checkSaldo(){
    this.carrelloService.checkSaldo(
      this.idUtente!,
      this.totaleCarrello
    ).subscribe({
      next: (flag) => {
        this.flagCheckout = flag;
        console.log(flag);
          },
      error: (err) => {
        this.flagCheckout = true;
        console.error(err);
      }
    });
  }
}