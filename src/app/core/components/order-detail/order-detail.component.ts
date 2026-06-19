import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderResponseDTO } from '../../interfaces/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: OrderResponseDTO,
    private orderService: OrderService
  ) {}

  downloadPDF(): void {
    if (!this.data.id) {
      console.error("orderId non presente per download PDF");
      return;
    }

    this.orderService.showOrderPDF(this.data.id).subscribe({
      next: (pdfBlob: Blob) => {
        const fileURL = URL.createObjectURL(pdfBlob);
        window.open(fileURL, '_blank');
      },
      error: (err) => {
        console.error("Errore nel caricamento PDF:", err);
      }
    });
  }
}
