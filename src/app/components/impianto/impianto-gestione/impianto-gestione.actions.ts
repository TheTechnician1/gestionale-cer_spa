export type ImpiantoRowAction = "detail" | "edit" | "delete";

export interface ImpiantoActionConfig {
  icon: string;
  action: ImpiantoRowAction;
  ariaLabel: string;
  requiresEdit: boolean;
}

export const IMPIANTO_ACTIONS: ImpiantoActionConfig[] = [
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
