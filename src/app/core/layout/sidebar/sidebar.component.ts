import { Component } from "@angular/core";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", route: "/dashboard" },
  { label: "Registrazione", icon: "person_add", route: "/registrazione" },
  {
    label: "Anagrafiche",
    icon: "badge",
    children: [
      { label: "Clienti", icon: "groups", route: "/anagrafiche/clienti" },
      { label: "Fornitori", icon: "local_shipping", route: "/anagrafiche/fornitori" },
    ],
  },
  { label: "Comunità Energetiche", icon: "factory" , route: "/cer"},
  { label: "Configurazioni", icon: "cabin", route: "/configurazioni"},
  {
    label: "Impianti",
    icon: "bolt",
    children: [
      { label: "Monitoraggio", icon: "monitor_heart", route: "/impianti/monitoraggio" },
      { label: "Manutenzioni", icon: "build", route: "/impianti/manutenzioni" },
    ],
  },
  { label: "Impostazioni", icon: "settings", route: "/impostazioni" },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
  treeControl = new NestedTreeControl<NavItem>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<NavItem>();

  constructor() {
    this.dataSource.data = NAV_ITEMS;
  }

  hasChild = (_: number, node: NavItem) => !!node.children && node.children.length > 0;
}
