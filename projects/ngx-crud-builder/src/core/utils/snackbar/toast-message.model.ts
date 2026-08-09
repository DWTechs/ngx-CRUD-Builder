export type ToastSeverity = "success" | "info" | "warn" | "error";

export interface ToastMessage {
  id: number;
  severity: ToastSeverity;
  summary?: string;
  detail?: string;
  /** Auto-dismiss delay in ms. */
  life: number;
}
