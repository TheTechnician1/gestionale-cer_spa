import { Component, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";
import { ToastService } from "../services/toast.service";

@Component({
  selector: "app-full-layout",
  templateUrl: "./full-layout.component.html",
  styleUrls: ["./full-layout.component.scss"],
})
export class FullLayoutComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private viewContainerRef: ViewContainerRef,
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  isLoggedIn$: Observable<boolean>;

  ngOnInit() {
    this.toastService.registerViewContainerRef(this.viewContainerRef);
  }

  ngOnDestroy(): void {
    this.toastService.clearViewContainerRef(this.viewContainerRef);
  }
}
