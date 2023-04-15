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
        path: 'user',
        title: 'Usuarios',
        type: 'link',
        smallTitle: 'US'
      },
      {
        path: 'teacher',
        title: 'profesores',
        type: 'link',
        smallTitle: 'TE'
      },
      {
        path: 'admin',
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
    path: '/trading-area',
    title: 'area trader',
    type: 'sub',
    icontype: 'tim-icons icon-trophy',
    role: [ROLES_ENUM.ALL],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: 'home',
        title: 'inicio',
        type: 'link',
        smallTitle: 'IN'
      },
      // {
      //   path: 'ranking',
      //   title: 'ranking',
      //   type: 'link',
      //   smallTitle: 'RK'
      // },
      {
        path: 'orders',
        title: 'ordenes',
        type: 'link',
        smallTitle: 'RK'
      }
    ]
  },
  {
    path: '/self-management',
    title: 'autogestión',
    type: 'sub',
    icontype: 'tim-icons icon-trophy',
    role: [ROLES_ENUM.ALL],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: 'home',
        title: 'inicio',
        type: 'link',
        smallTitle: 'IN'
      },
      // {
      //   path: 'funds',
      //   title: 'fondos',
      //   type: 'link',
      //   smallTitle: 'FO'
      // },
      // {
      //   path: 'withdrawals',
      //   title: 'retiros y comiciones',
      //   type: 'link',
      //   smallTitle: 'WT'
      // },
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

// Routes to ADMIN
export const ROUTES_ADMIN: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    type: 'link',
    icontype: 'tim-icons icon-chart-pie-36',
    role: [ROLES_ENUM.ALL]
  },
  {
    path: '/users',
    title: 'Roles',
    type: 'sub',
    icontype: 'tim-icons icon-single-02',
    role: [ROLES_ENUM.ADMIN],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: 'user',
        title: 'Usuarios',
        type: 'link',
        smallTitle: 'US'
      },
      {
        path: 'admin',
        title: 'administradores',
        type: 'link',
        smallTitle: 'AD'
      },
      {
        path: 'teacher',
        title: 'profesores',
        type: 'link',
        smallTitle: 'TE'
      }
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
    path: '/funding-program',
    title: 'Funding program',
    type: 'sub',
    icontype: 'tim-icons icon-coins',
    role: [ROLES_ENUM.ALL],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: '/home',
        title: 'Inicio',
        type: 'link',
        smallTitle: 'TP'
      },
      {
        path: '/order',
        title: 'Ordenes',
        type: 'link',
        smallTitle: 'TP'
      },
      {
        path: '/trading-area-packages',
        title: 'Area Trading Paquetes',
        type: 'link',
        smallTitle: 'TP'
      },
      {
        path: '/withdrawals',
        title: 'retiros de beneficios',
        type: 'link',
        smallTitle: 'WT'
      },
      {
        path: '/ranking',
        title: 'ranking',
        type: 'link',
        smallTitle: 'RK'
      },
    ]
  },
  {
    path: '/self-management',
    title: 'autogestión de fondos',
    type: 'sub',
    icontype: 'tim-icons icon-trophy',
    role: [ROLES_ENUM.ALL],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: '/home',
        title: 'Inicio',
        type: 'link',
        smallTitle: 'TP'
      },
      {
        path: '/order',
        title: 'Ordenes',
        type: 'link',
        smallTitle: 'TP'
      },
      {
        path: '/academy',
        title: 'academia',
        type: 'link',
        smallTitle: 'AC'
      },
       {
         path: '/global-withdrawals',
         title: 'retiros y comiciones globales',
         type: 'link',
         smallTitle: 'G&W'
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
    path: '/billing',
    title: 'Facturación',
    type: 'link',
    icontype: 'tim-icons icon-single-02',
    role: [ROLES_ENUM.ALL],
  },
];

// Routes to TEACHER
export const ROUTES_TEACHER: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    type: 'link',
    icontype: 'tim-icons icon-chart-pie-36',
    role: [ROLES_ENUM.ALL]
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
    path: '/funding-program',
    title: 'Funding program',
    type: 'sub',
    icontype: 'tim-icons icon-coins',
    role: [ROLES_ENUM.ALL],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: '/trading-area',
        title: 'Area Trading',
        type: 'link',
        smallTitle: 'AT'
      },
      {
        path: '/withdrawals',
        title: 'retiros de beneficios',
        type: 'link',
        smallTitle: 'WT'
      },
      {
        path: '/ranking',
        title: 'ranking',
        type: 'link',
        smallTitle: 'RK'
      },
    ]
  },
  {
    path: '/self-management',
    title: 'autogestión de fondos',
    type: 'sub',
    icontype: 'tim-icons icon-trophy',
    role: [ROLES_ENUM.ALL, ROLES_ENUM.TEACHER],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: '/academy',
        title: 'academia',
        type: 'link',
        smallTitle: 'AC'
      },
       {
         path: 'withdrawals',
         title: 'retiros y comisiones',
         type: 'link',
         smallTitle: 'WT'
       },
    ]
  },
  {
    path: '/billing',
    title: 'Facturacion',
    type: 'link',
    icontype: 'tim-icons icon-single-02',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '/downloads',
    title: 'descargas',
    type: 'link',
    icontype: 'tim-icons icon-single-02',
    role: [ROLES_ENUM.ALL],
  }
];

// Routes to USER
export const ROUTES_USER: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    type: 'link',
    icontype: 'tim-icons icon-chart-pie-36',
    role: [ROLES_ENUM.ALL]
  },
  {
    path: '/funding-program',
    title: 'Funding program',
    type: 'sub',
    icontype: 'tim-icons icon-coins',
    role: [ROLES_ENUM.ALL],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: '/trading-area',
        title: 'Area Trading',
        type: 'link',
        smallTitle: 'AT'
      },
      {
        path: '/withdrawals',
        title: 'retiros de beneficios',
        type: 'link',
        smallTitle: 'WT'
      },
      {
        path: '/ranking',
        title: 'ranking',
        type: 'link',
        smallTitle: 'RK'
      },
    ]
  },
  {
    path: '/self-management',
    title: 'autogestión de fondos',
    type: 'sub',
    icontype: 'tim-icons icon-trophy',
    role: [ROLES_ENUM.ALL, ROLES_ENUM.TEACHER],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: '/academy',
        title: 'academia',
        type: 'link',
        smallTitle: 'AC'
      },
       {
         path: 'withdrawals',
         title: 'retiros y comisiones',
         type: 'link',
         smallTitle: 'WT'
       },
    ]
  },
  {
    path: '/billing',
    title: 'Facturacion',
    type: 'link',
    icontype: 'tim-icons icon-single-02',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '/downloads',
    title: 'descargas',
    type: 'link',
    icontype: 'tim-icons icon-single-02',
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
];

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

    if (this.rol === 'admin') {
      this.menuItems = ROUTES_ADMIN;
    } else if (this.rol === 'teacher') {
      this.menuItems = ROUTES_TEACHER;
    } else if (this.rol === 'user') {
      this.menuItems = ROUTES_USER;
    }

  }
}
