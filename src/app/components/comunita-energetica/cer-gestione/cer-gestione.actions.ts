export type CerRowAction = "detail" | "edit" | "delete";

export interface CerActionConfig {
  icon: string;
  action: CerRowAction;
  ariaLabel: string;
  requiresEdit: boolean;
}

export const CER_ACTIONS: CerActionConfig[] = [
  {
    icon: "visibility",
    action: "detail",
    ariaLabel: "Dettaglio",
    requiresEdit: false,
  },
  {
    icon: "edit",
    action: "edit",
    ariaLabel: "Modifica",
    requiresEdit: true,
  },
  {
    icon: "delete",
    action: "delete",
    ariaLabel: "Cancella",
    requiresEdit: true,
  },
];
