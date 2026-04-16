import { Component, OnInit } from "@angular/core";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { AuthService } from "../../services/auth.service";
import { isEmptyArray } from '../../util/collection.util';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", route: "/dashboard" },
  { label: "Anagrafiche", icon: "badge", children: [
    { label: "Profilo", icon: "account_box", route: "/profilo-utente"},
    { label: "Registrazione", icon: "person_add", route: "/registrazione" },
  ]},
  { label: "Comunità Energetiche", icon: "factory" , route: "/cer"},
  { label: "Configurazioni", icon: "cabin", route: "/configurazioni"},
  { label: "Impianti", icon: "bolt", route: "/impianti" },
];


@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit{

  treeControl = new NestedTreeControl<NavItem>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<NavItem>();

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isLogged$.subscribe(status => {
      this.dataSource.data = status ? NAV_ITEMS: [];
    });
  }

  hasChild = (_: number, node: NavItem) => !!node.children && node.children.length > 0;

  private filterNavItems(items: NavItem[], role: string | null): NavItem[] {
    if (!role) {
      return [];
    }

    return items
      .map((item) => {
        const children = item.children ? this.filterNavItems(item.children, role) : undefined;
        return { ...item, children };
      })
      .filter((item) => {
        const roleAllowed = !item.roles || item.roles.includes(role);
        const hasChildren = !!item.children && item.children.length > 0;
        return roleAllowed && (item.route || hasChildren);
      });
}
