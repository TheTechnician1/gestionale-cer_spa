import { Component } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { LoginService } from '../../services/login.service';
import { Role } from '../../util/role.enum';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  roles?: Role[];
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/home' },
  {
    label: 'CER',
    icon: 'badge',
    children: [
      { label: 'Ricerca CER', icon: 'search', route: '/tabella-cer' },
      { label: 'Nuova CER', icon: 'add_circle', route: '/cer/new', roles: [Role.ADMIN] },
      { label: 'CER disattivate', icon: 'inventory_2', route: '/cer/disattivate', roles: [Role.ADMIN] },
    ],
  },
  {
    label: 'Configurazioni',
    icon: 'account_tree',
    children: [
      { label: 'Ricerca configurazioni', icon: 'search', route: '/configurazioni' },
      {
        label: 'Nuova configurazione',
        icon: 'add_circle',
        route: '/configurazioni/new',
        roles: [Role.ADMIN],
      },
      {
        label: 'Configurazioni disattivate',
        icon: 'inventory_2',
        route: '/configurazioni/disattivate',
        roles: [Role.ADMIN],
      },
    ],
  },
  {
    label: 'Impianti',
    icon: 'bolt',
    children: [
      { label: 'Ricerca impianti', icon: 'search', route: '/impianti' },
      { label: 'Nuovo impianto', icon: 'add_circle', route: '/impianti/new', roles: [Role.ADMIN] },
    ],
  },
  {
    label: 'Dati energetici',
    icon: 'energy_savings_leaf',
    children: [
      { label: 'Ricerca dati energetici', icon: 'search', route: '/dati-energetici' },
      {
        label: 'Nuova scheda energetica',
        icon: 'add_circle',
        route: '/dati-energetici/new',
        roles: [Role.ADMIN],
      },
    ],
  },
  { label: 'Impostazioni', icon: 'settings', route: '/impostazioni' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  treeControl = new NestedTreeControl<NavItem>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<NavItem>();

  constructor(private loginService: LoginService) {
    this.dataSource.data = this.filtraMenuPerRuolo(NAV_ITEMS);
  }

  hasChild = (_: number, node: NavItem) =>
    !!node.children && node.children.length > 0;

  private filtraMenuPerRuolo(items: NavItem[]): NavItem[] {
    const ruolo = this.loginService.currentUser?.ruolo as Role | null;

    return items
      .filter((item) => !item.roles || (!!ruolo && item.roles.includes(ruolo)))
      .map((item) => ({
        ...item,
        children: item.children ? this.filtraMenuPerRuolo(item.children) : undefined,
      }))
      .filter((item) => !item.children || item.children.length > 0);
  }
}
