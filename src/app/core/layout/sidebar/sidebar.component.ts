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
  { label: "Comunità Energetiche", icon: "factory" , route: "/cer"},
  { label: "Configurazioni", icon: "cabin", route: "/configurazioni"},
  { label: "Impianto", icon: "bolt", route: "/impianto" },
  { label: "Dati Energetici", icon: "settings", route:"/dati-energetici" }
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
