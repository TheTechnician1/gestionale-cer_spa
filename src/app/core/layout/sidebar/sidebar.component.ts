import { Component } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  {
    label: 'CER',
    icon: 'badge',
    children: [
      { label: 'Ricerca CER', icon: 'search', route: '/tabella-cer' },
      { label: 'Nuova CER', icon: 'add_circle', route: '/cer/new' },
    ],
  },
  {
    label: 'Impianti',
    icon: 'bolt',
    children: [
      {
        label: 'Monitoraggio',
        icon: 'monitor_heart',
        route: '/impianti/monitoraggio',
      },
      { label: 'Manutenzioni', icon: 'build', route: '/impianti/manutenzioni' },
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

  constructor() {
    this.dataSource.data = NAV_ITEMS;
  }

  hasChild = (_: number, node: NavItem) =>
    !!node.children && node.children.length > 0;
}
