import { Component, OnInit, OnDestroy } from "@angular/core";
import { ErrorService } from "../services/error.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-full-layout",
  templateUrl: "./full-layout.component.html",
  styleUrls: ["./full-layout.component.scss"],
})
export class FullLayoutComponent implements OnInit, OnDestroy {
  erroreServer = false;
  private sub: Subscription = new Subscription();

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.sub = this.errorService.errore$.subscribe(val => {
      this.erroreServer = val;
    });
  }

  riprova(): void {
    this.errorService.clearErrore();
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
