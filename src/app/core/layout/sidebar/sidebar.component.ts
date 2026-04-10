import { Component, OnDestroy, OnInit } from "@angular/core";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { Subscription } from "rxjs";
import { AuthService } from "../../services/auth.service";

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "sidebar.items.dashboard", icon: "dashboard", route: "/dashboard", roles: ["ADMIN", "GEST", "GUEST"] },
  { label: "sidebar.items.cer", icon: "groups", route: "/cer", roles: ["ADMIN", "GEST", "GUEST"] },
  { label: "sidebar.items.configurazioni", icon: "settings", route: "/configurazioni", roles: ["ADMIN", "GEST"] },
  { label: "sidebar.items.impianti", icon: "solar_power", route: "/impianti", roles: ["ADMIN", "GEST"] },
  { label: "sidebar.items.dati energetici", icon: "bar_chart", route: "/dati-energetici", roles: ["ADMIN", "GEST"] },
  { label: "sidebar.items.registrazione", icon: "person_add", route: "/registrazione", roles: ["ADMIN"] },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit, OnDestroy {
  treeControl = new NestedTreeControl<NavItem>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<NavItem>();
  private sub?: Subscription;

  constructor(private authService: AuthService) {
    this.dataSource.data = NAV_ITEMS;
  }

  ngOnInit(): void {
    this.sub = this.authService.user$.subscribe((user) => {
      const role = user?.ruolo ?? null;
      this.dataSource.data = this.filterNavItems(NAV_ITEMS, role);
      this.treeControl.collapseAll();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
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
