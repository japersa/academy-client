import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../../core/services/user-data.service';

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  smallTitle?: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}
export interface ChildrenItems2 {
  path?: string;
  smallTitle?: string;
  title?: string;
  type?: string;
}
// Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    type: 'link',
    icontype: 'tim-icons icon-chart-pie-36',
  },
  {
    path: '/roles',
    title: 'roles',
    type: 'link',
    icontype: 'tim-icons icon-single-02',
  },
  {
    path: '',
    title: 'Profesores',
    type: 'sub',
    icontype: 'tim-icons icon-single-copy-04',
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: 'course-by-steps',
        title: 'Crear curso',
        type: 'link',
        smallTitle: 'CP'
      },
      {
        path: 'admin-courses',
        title: 'Admin cursos',
        type: 'link',
        smallTitle: 'AC'
      },
      {
        path: 'ama',
        title: 'dudas',
        type: 'link',
        smallTitle: 'D&C'
      },
    ]
  },
  {
    path: '',
    title: 'area trader',
    type: 'sub',
    icontype: 'tim-icons icon-trophy',
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: 'trading-area',
        title: 'trading',
        type: 'link',
        smallTitle: 'TG'
      },
      {
        path: 'ranking',
        title: 'ranking',
        type: 'link',
        smallTitle: 'RK'
      },
    ]
  },
  {
    path: '',
    title: 'autogestión',
    type: 'sub',
    icontype: 'tim-icons icon-trophy',
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: 'funds',
        title: 'fondos',
        type: 'link',
        smallTitle: 'FO'
      },
      {
        path: 'withdrawals',
        title: 'retiros y comiciones',
        type: 'link',
        smallTitle: 'WT'
      },
    ]
  },
  {
    path: '/downloads',
    title: 'descargas',
    type: 'link',
    icontype: 'tim-icons icon-single-02',
  },
  {
    path: '/billing',
    title: 'Facturacion',
    type: 'link',
    icontype: 'tim-icons icon-single-02',
  },
  {
    path: '/home',
    title: 'cursos',
    type: 'link',
    icontype: 'tim-icons icon-trophy'
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  profileMenuItems: any = [
    {
      path: '/profile',
      title: 'perfil',
      type: 'link',
      icontype: 'tim-icons icon-chart-pie-36',
    },
    {
      path: 'https://intcapex.com/',
      title: 'Pagina Web',
      type: 'link',
      icontype: 'tim-icons icon-chart-pie-36',
    },
    {
      path: '/customer-service',
      title: 'Servicio al Cliente',
      type: 'link',
      icontype: 'tim-icons icon-chart-pie-36',
    },
  ]
 
  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => {
      if (this.userDataService?.userData$?.value?.rol === 'teacher' && (menuItem.path === '/roles' || menuItem.path === '/dashboard')) {
        return
      } else {
        return menuItem
      }
    });
  }
}
