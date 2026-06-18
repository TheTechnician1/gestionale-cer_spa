import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { OrderService } from '../../services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtenteService } from '../../services/utente.service';
import { OrderDetailComponent } from '../order-detail/order-detail.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  constructor(private ordersService: OrderService, private auth: UtenteService, private dialog: MatDialog) {}
  user = this.auth.currentUser;

  displayedColumns: string[] = ['codiceOrdine', 'date', 'total', 'status', 'itemsCount', 'actions'];
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
  orderStatuses = ['CREATO', 'PAGATO', 'COMPLETATO'];

  ngOnInit() {
    this.loadOrders();
  }

  ngAfterViewInit() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'date':
          return new Date(item.date).getTime();
        case 'total':
          return Number(item.total);
        case 'codiceOrdine':
          return item.codiceOrdine?.toLowerCase();
        case 'status':
          return item.status;
        case 'itemsCount':
          return Number(item.itemsCount ?? 0);
        default:
          return item[property];
      }
    };
  }

  loadOrders() {
    this.loading = true;
    const userId = this.user?.id;
    this.ordersService.getAllOrders(userId!).subscribe({
      next: (res) => {
        this.orders = res;
        this.dataSource.data = res;

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.totalOrders = res.length;
        this.applyClientFilters();
        this.loading = false;
      },
      error: () => {
        this.orders = [];
        this.dataSource.data = [];
        this.totalOrders = 0;
        this.loading = false;
      }
    });
  }

  applyClientFilters() {
    let filtered = [...this.orders];
    const value = this.filterValue?.trim().toLowerCase();
    if(value) {
      filtered = filtered.filter(o =>
        o.codiceOrdine?.toLowerCase().includes(this.filterValue) ||
        o.date?.toString().toLowerCase().includes(value) ||
        o.total?.toString().toLowerCase().includes(value) ||
        o.status?.toLowerCase().includes(value)
      );
    }
    if (this.statusFilter) {
      filtered = filtered.filter(o => o.status === this.statusFilter);
    }

    this.dataSource.data = filtered;
    this.totalOrders = filtered.length;
  }

  applyFilter(value: string) {
    this.filterValue = value.trim().toLowerCase();
    this.applyClientFilters();
  }

  clearFilter() {
    this.filterValue = '';
    this.loadOrders();
  }

  filterByStatus(status: string) {
    this.statusFilter = status;
    this.applyClientFilters();
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
    this.ordersService.getOrderById(order.id).subscribe({
    next: (fullOrder) => {
      this.dialog.open(OrderDetailComponent, {
        width: '700px',
        data: fullOrder
      });
    },
    error: (err) => {
      console.error('Errore caricamento dettaglio ordine', err);
    }
  });
  }

  statusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'CREATO': return 'warn';
      case 'PAGATO': return 'primary';
      case 'COMPLETATO': return 'accent';
      default: return 'primary';
    }
  }

  orderDetailsTemplate: any;
}
