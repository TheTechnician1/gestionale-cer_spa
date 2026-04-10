import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ToastPayload, ToastService } from "../../../core/services/toast.service";

interface ToastView extends ToastPayload {
  id: number;
}

@Component({
  selector: "app-toast-host",
  templateUrl: "./toast-host.component.html",
  styleUrls: ["./toast-host.component.scss"],
})
export class ToastHostComponent implements OnInit, OnDestroy {
  toasts: ToastView[] = [];
  private sub?: Subscription;
  private counter = 0;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toastService.toast$.subscribe((toast) => {
      const id = ++this.counter;
      this.toasts = [...this.toasts, { ...toast, id }];
      setTimeout(() => this.dismiss(id), 5000);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
  }
}
