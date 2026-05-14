import { Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";

export type DialogCloseReason = "confirm" | "cancel" | "dismiss";

@Component({
  selector: "app-confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
  styleUrls: ["./confirmation-dialog.component.scss"],
})
export class ConfirmationDialogComponent implements OnDestroy {
  @Input() title = "Conferma operazione";
  @Input() description = "";
  @Input() confirmText = "Conferma";
  @Input() cancelText = "Annulla";
  @Input() width = "440px";
  @Input() disableClose = false;
  @Input() hasBackdrop = true;
  @Input() panelClass: string | string[] = [];

  @Output() confirm = new EventEmitter<unknown>();
  @Output() cancel = new EventEmitter<void>();
  @Output() closed = new EventEmitter<DialogCloseReason>();

  @ViewChild("dialogTemplate") private dialogTemplate?: TemplateRef<{ payload: unknown }>;

  private dialogRef?: MatDialogRef<unknown, DialogCloseReason>;
  private afterClosedSub?: Subscription;
  private payload: unknown;

  constructor(private dialog: MatDialog) {}

  open(payload?: unknown): void {
    if (!this.dialogTemplate) {
      return;
    }

    this.payload = payload;
    this.close();

    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: this.width,
      disableClose: this.disableClose,
      hasBackdrop: this.hasBackdrop,
      panelClass: this.panelClass,
      data: { payload },
    });

    this.afterClosedSub?.unsubscribe();
    this.afterClosedSub = this.dialogRef.afterClosed().subscribe((reason) => {
      if (reason === "confirm") {
        this.confirm.emit(this.payload);
      } else if (reason === "cancel") {
        this.cancel.emit();
      }

      this.closed.emit(reason ?? "dismiss");
      this.dialogRef = undefined;
      this.payload = undefined;
    });
  }

  close(reason: DialogCloseReason = "dismiss"): void {
    this.dialogRef?.close(reason);
  }

  isOpen(): boolean {
    return !!this.dialogRef;
  }

  onCancelClick(): void {
    this.close("cancel");
  }

  onConfirmClick(): void {
    this.close("confirm");
  }

  ngOnDestroy(): void {
    this.afterClosedSub?.unsubscribe();
    this.close();
  }
}
