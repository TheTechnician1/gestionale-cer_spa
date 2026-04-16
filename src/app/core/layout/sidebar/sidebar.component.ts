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
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", route: "/dashboard", roles: ["ADMIN", "GEST", "GUEST"] },
  { label: "Anagrafiche", icon: "badge", roles: ["ADMIN", "GEST"], children: [
    { label: "Profilo", icon: "account_box", route: "/profilo-utente"},
    { label: "Registrazione", icon: "person_add", route: "/registrazione", roles: ["ADMIN"] },
  ]},
  { label: "Comunità Energetiche", icon: "factory" , route: "/cer", roles: ["ADMIN", "GEST", "GUEST"]},
  { label: "Configurazioni", icon: "cabin", route: "/configurazioni", roles: ["ADMIN", "GEST", "GUEST"]},
  { label: "Impianto", icon: "bolt", route: "/impianto", roles: ["ADMIN", "GEST", "GUEST"] },
  { label: "Dati Energetici", icon: "settings", route:"/dati-energetici", roles: ["ADMIN", "GEST", "GUEST"] }
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
      this.dataSource.data = status ? this.filterNavItems(NAV_ITEMS, this.authService.getRole()): [];
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
}
