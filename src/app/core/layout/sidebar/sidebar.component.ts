import { Component, OnDestroy, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { UtenteService } from '../../services/utente.service';
import { distinctUntilChanged, map, Subscription } from 'rxjs';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    roles: ['ADMIN', 'GEST', 'GUEST'],
  },
  {
    label: 'Anagrafiche',
    icon: 'badge',
    roles: ['ADMIN', 'GEST'],
    children: [
      { label: 'Profilo', icon: 'account_box', route: '/profilo/:id' },
      {
        label: 'Registrazione',
        icon: 'person_add',
        route: '/registrazione',
        roles: ['ADMIN'],
      },
    ],
  },
  {
    label: 'Impianto',
    icon: 'bolt',
    roles: ['ADMIN', 'GEST', 'GUEST'],
    children: [
      {
        label: 'Lista Impianti',
        icon: 'list',
        route: '/impianto',
        roles: ['ADMIN', 'GEST', 'GUEST'],
      },
      {
        label: 'Nuovo Impianto',
        icon: 'add_circle',
        route: '/impianto/inserimento-impianto',
        roles: ['ADMIN', 'GEST'],
      },
      {
        label: 'Modifica Impianto',
        icon: 'edit',
        route: '/impianto/modifica-impianto/1',
        roles: ['ADMIN', 'GEST'],
      },
      {
        label: 'Dettaglio Impianto',
        icon: 'visibility',
        route: '/impianto/dettaglio-impianto/1',
        roles: ['ADMIN', 'GEST', 'GUEST'],
      },
    ],
  },

  {
    label: 'Dati Energetici',
    icon: 'power',
    roles: ['ADMIN', 'GEST', 'GUEST'],
    children: [
      {
        label: 'Lista Dati Energetici',
        icon: 'list',
        route: '/dati-energetici',
        roles: ['ADMIN', 'GEST', 'GUEST'],
      },
      {
        label: 'Nuovi Dati Energetici',
        icon: 'add_circle',
        route: '/dati-energetici/inserimento-dati',
        roles: ['ADMIN', 'GEST', 'GUEST'],
      },

      {
        label: 'Modifica Dati Energetici',
        icon: 'edit',
        route: '/dati-energetici/modifica-dati/1',
        roles: ['ADMIN', 'GEST'],
      },
      {
        label: 'Dettaglio Dati Energetici',
        icon: 'visibility',
        route: '/dati-energetici/dettaglio-dati/1',
        roles: ['ADMIN', 'GEST', 'GUEST'],
      },
    ],
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  treeControl = new NestedTreeControl<NavItem>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<NavItem>();

  private sub?: Subscription;

  constructor(private authService: UtenteService) {}

  ngOnInit(): void {
    // Costruisce l'albero UNA SOLA VOLTA per ruolo: i riferimenti dei nodi
    // restano stabili, così il treeControl mantiene l'espansione e i toggle
    // continuano a funzionare anche dopo nuove emissioni di user$.
    this.sub = this.authService.user$
      .pipe(
        map((user) => user?.ruolo ?? null),
        distinctUntilChanged(),
      )
      .subscribe((role) => {
        this.dataSource.data = this.filterNavItems(NAV_ITEMS, role);
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  hasChild = (_: number, node: NavItem) =>
    !!node.children && node.children.length > 0;

  private filterNavItems(items: NavItem[], role: string | null): NavItem[] {
    if (!role) {
      return [];
    }

    return items
      .map((item) => {
        const children = item.children
          ? this.filterNavItems(item.children, role)
          : undefined;
        return { ...item, children };
      })
      .filter((item) => {
        const roleAllowed = !item.roles || item.roles.includes(role);
        const hasChildren = !!item.children && item.children.length > 0;
        return roleAllowed && (item.route || hasChildren);
      });
  }
}
