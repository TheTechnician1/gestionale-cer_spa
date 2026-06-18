import { Component, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { UtenteService } from "../services/utente.service";
import { Observable } from "rxjs";
import { ToastService } from "../services/toast.service";

@Component({
  selector: "app-general",
  templateUrl: "./general.component.html",
  styleUrls: ["./general.component.scss"],
})
export class GeneralComponent implements OnInit, OnDestroy {
  constructor(
    private authService: UtenteService,
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
