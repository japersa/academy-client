import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '../../../../core/services/user-data.service';
import { ROLES_ENUM } from 'src/app/shared/enum/roles.enum';

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  role: ROLES_ENUM[];
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
    role: [ROLES_ENUM.ADMIN]
  },
  {
    path: '/users',
    title: 'users',
    type: 'sub',
    icontype: 'tim-icons icon-single-02',
    role: [ROLES_ENUM.ADMIN],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: 'all',
        title: 'todos',
        type: 'link',
        smallTitle: 'AL'
      },
      {
        path: 'users',
        title: 'Usuarios',
        type: 'link',
        smallTitle: 'US'
      },
      {
        path: 'teachers',
        title: 'profesores',
        type: 'link',
        smallTitle: 'TE'
      },
      {
        path: 'admins',
        title: 'administradores',
        type: 'link',
        smallTitle: 'AD'
      },
    ]
  },
  {
    path: '',
    title: 'Profesores',
    type: 'sub',
    icontype: 'tim-icons icon-single-copy-04',
    role: [ROLES_ENUM.ADMIN, ROLES_ENUM.TEACHER],
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
    role: [ROLES_ENUM.ALL],
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
      }
    ]
  },
  {
    path: '',
    title: 'autogestión',
    type: 'sub',
    icontype: 'tim-icons icon-trophy',
    role: [ROLES_ENUM.ALL],
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
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '/billing',
    title: 'Facturacion',
    type: 'link',
    icontype: 'tim-icons icon-single-02',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '/home',
    title: 'cursos',
    type: 'link',
    icontype: 'tim-icons icon-trophy',
    role: [ROLES_ENUM.ALL],
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
      path: '/packages',
      title: 'solicitud de paquetes',
      type: 'link',
      icontype: 'tim-icons icon-chart-pie-36',
    },
    {
      path: '/profile',
      title: 'clientes',
      type: 'link',
      icontype: 'tim-icons icon-chart-pie-36',
    },
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

  constructor(private router: Router,
    private userDataService: UserDataService) { }

  public rol: string;

  private adminButtonAction() {
    this.router.navigate(['/trading-area/create-pack'])
  }

  private clientButtonAction() {
    this.router.navigate(['/trading-area/create-pack'])
  }

  ngOnInit() {
    this.userDataService.userData$.subscribe(userData => {
      this.rol = userData.rol;
    });
    console.log(this.rol);

    this.menuItems = ROUTES.filter(menuItem => {
      if (this.userDataService?.userData$?.value?.rol === 'teacher' && (menuItem.path === '/roles' || menuItem.path === '/dashboard')) {
        return
      } else {
        return menuItem
      }
    });
  }
}
