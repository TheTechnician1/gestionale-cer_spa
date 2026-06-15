import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { OrderService } from '../../services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  constructor(private ordersService: OrderService, private dialog: MatDialog) {}
  @Input() userId!: number;

  displayedColumns: string[] = ['id', 'date', 'total', 'status', 'items', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  orders: any[] = [];
  totalOrders = 0;
  pageSize = 10;
  pageIndex = 0;
  loading = true;
  filterValue = '';
  statusFilter = '';
  orderStatuses = ['In elaborazione', 'Spedito', 'Consegnato', 'Annullato'];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    const params = {
      page: this.pageIndex + 1,
      size: this.pageSize,
      q: this.filterValue,
      status: this.statusFilter
    };
    this.ordersService.getAllOrders(this.userId, params).subscribe({
      next: (res) => {
        this.orders = res.items;
        this.totalOrders = res.total;
        this.dataSource.data = this.orders;
        setTimeout(() => {
          if (this.paginator) this.dataSource.paginator = this.paginator;
          if (this.sort) this.dataSource.sort = this.sort;
        });
        this.loading = false;
      },
      error: () => {
        this.orders = [];
        this.dataSource.data = [];
        this.loading = false;
      }
    });
  }

  applyFilter(value: string) {
    this.filterValue = value.trim().toLowerCase();
    this.pageIndex = 0;
    this.loadOrders();
  }

  clearFilter() {
    this.filterValue = '';
    this.loadOrders();
  }

  filterByStatus(status: string) {
    this.statusFilter = status;
    this.pageIndex = 0;
    this.loadOrders();
  }

  pageChanged(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }

  refresh() {
    this.loadOrders();
  }

  openDetails(order: any) {
    this.dialog.open(this.orderDetailsTemplate, { data: { order } });
  }

  cancelOrder(order: any) {
    // chiamata al servizio per annullare con conferma
    if (!confirm(`Annullare l'ordine ${order.id}?`)) return;
    this.ordersService.cancelOrder(order.id).subscribe({
      next: () => this.loadOrders(),
      error: () => alert('Impossibile annullare l\'ordine')
    });
  }

  statusColor(status: string) {
    switch (status) {
      case 'In elaborazione': return 'warn';
      case 'Spedito': return 'primary';
      case 'Consegnato': return 'accent';
      case 'Annullato': return '';
      default: return '';
    }
  }

  orderDetailsTemplate: any;
}
