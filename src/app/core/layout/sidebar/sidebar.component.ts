import { Component, OnInit } from "@angular/core";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { AuthService } from "../../services/auth.service";

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Prodotti", icon: "store", route: "/products" },
  { label: "Carrello", icon: "shopping_cart", route: "/cart" },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  treeControl = new NestedTreeControl<NavItem>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<NavItem>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.dataSource.data = NAV_ITEMS;
  }

  hasChild = (_: number, node: NavItem) => 
    !!node.children && node.children.length > 0;

}
