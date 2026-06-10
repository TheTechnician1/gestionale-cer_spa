import { Component, OnInit } from "@angular/core";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { isEmptyArray } from "../../util/collection.util";
import { UtenteService } from "../../services/utente.service";
import { BehaviorSubject, map, Observable } from "rxjs";
import { LocalizedString } from "@angular/compiler";

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
  ngOnInit(): void {
  }

}
