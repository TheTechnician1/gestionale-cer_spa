import { Component, OnInit } from "@angular/core";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { isEmptyArray } from "../../util/collection.util";
import { UtenteService } from "../../services/utente.service";
import { BehaviorSubject, map, Observable } from "rxjs";

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", route: "/dashboard", roles: ["ADMIN", "GEST", "GUEST"] },
  {
    label: "Anagrafiche",
    icon: "badge",
    roles: ["ADMIN", "GEST"],
    children: [
      { label: "Profilo", icon: "account_box", route: "/profilo/:id" },
      { label: "Registrazione", icon: "person_add", route: "/registrazione", roles: ["ADMIN"] },
    ],
  },
  { label: "Impianto", icon: "bolt", route: "/impianto", roles: ["ADMIN", "GEST", "GUEST"] },
  { label: "Dati Energetici", icon: "settings", route: "/dati-energetici", roles: ["ADMIN", "GEST", "GUEST"] },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  treeControl = new NestedTreeControl<NavItem>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<NavItem>();
  dataSource$ = this.authService.user$.pipe(
    map((user) => {
      const role = user?.ruolo ?? null;
      const ds = new MatTreeNestedDataSource<NavItem>();
      ds.data = this.filterNavItems(NAV_ITEMS, role);
      return ds;
    }),
  );
  constructor(private authService: UtenteService) {}

  ngOnInit() {}

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
