export type ConfigRowAction = "detail" | "edit" | "delete";

export interface ConfigActionConfig {
  icon: string;
  action: ConfigRowAction;
  ariaLabel: string;
  requiresEdit: boolean;
}

export const CONFIG_ACTIONS: ConfigActionConfig[] = [
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
