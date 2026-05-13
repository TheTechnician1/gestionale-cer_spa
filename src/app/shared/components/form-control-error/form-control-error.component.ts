import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";

type ErrorTextMap = Record<string, string>;

@Component({
  selector: "mat-error[appFormControlError]",
  templateUrl: "./form-control-error.component.html",
  styleUrls: ["./form-control-error.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlErrorComponent {
  @Input() control: AbstractControl<unknown, unknown> | null = null;
  @Input() label = "Campo";
  @Input() customMessages: ErrorTextMap[] = [];

  private readonly errorPriority = ["required", "email", "minlength", "maxlength", "min", "max", "pattern"];

  get message(): string | null {
    if (!this.control || !this.control.invalid || (!this.control.touched && !this.control.dirty)) {
      return null;
    }

    const errors = this.control.errors;
    if (!errors) {
      return null;
    }

    const customMap = this.mergeCustomMessages();
    const errorKey = this.getFirstErrorKey(errors, customMap);

    if (!errorKey) {
      return null;
    }

    const customMessage = customMap[errorKey];
    if (customMessage) {
      return customMessage;
    }

    return this.buildDefaultMessage(errorKey, errors[errorKey]);
  }

  private mergeCustomMessages(): ErrorTextMap {
    return this.customMessages.reduce<ErrorTextMap>((acc, current) => ({ ...acc, ...current }), {});
  }

  private getFirstErrorKey(errors: ValidationErrors, customMessages: ErrorTextMap): string | null {
    const orderedKeys = [...Object.keys(customMessages), ...this.errorPriority, ...Object.keys(errors)];
    const first = orderedKeys.find((key) => key in errors);
    return first ?? null;
  }

  private buildDefaultMessage(errorKey: string, errorValue: unknown): string {
    switch (errorKey) {
      case "required":
        return `${this.label} obbligatorio`;
      case "email":
        return `${this.label} non valida`;
      case "minlength":
        return `${this.label} deve contenere almeno ${this.extractLength(errorValue, "requiredLength")} caratteri`;
      case "maxlength":
        return `${this.label} deve contenere massimo ${this.extractLength(errorValue, "requiredLength")} caratteri`;
      case "min":
        return `${this.label} deve essere almeno ${this.extractLength(errorValue, "min")}`;
      case "max":
        return `${this.label} deve essere al massimo ${this.extractLength(errorValue, "max")}`;
      case "pattern":
        return `${this.label} non rispetta il formato richiesto`;
      default:
        return `${this.label} non valida`;
    }
  }

  private extractLength(errorValue: unknown, property: string): number | string {
    if (!errorValue || typeof errorValue !== "object") {
      return "";
    }

    const numericValue = (errorValue as Record<string, unknown>)[property];
    return typeof numericValue === "number" ? numericValue : "";
  }
}
