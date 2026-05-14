export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastSnackbarData {
  title: string;
  message: string;
  type: ToastType;
  statusCode?: number;
}
