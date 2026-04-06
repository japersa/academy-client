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
    path: '/packages',
    title: 'packages',
    type: 'link',
    icontype: 'tim-icons icon-trophy',
    role: [ROLES_ENUM.ALL],
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
      {
        path: 'orders',
        title: 'ordenes',
        type: 'link',
        smallTitle: 'RK'
      }
    ]
  },
  {
    path: '/self-management/home',
    title: 'Academia',
    type: 'link',
    icontype: 'fa fa-graduation-cap',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '/self-management/withdrawals',
    title: 'Retiros y ganancias',
    type: 'link',
    icontype: 'tim-icons icon-money-coins',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '/downloads',
    title: 'descargas',
    type: 'link',
    icontype: 'tim-icons icon-single-02',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '#',
    title: 'Señales en vivo',
    type: 'sub',
    icontype: 'tim-icons currency-exchange',
    role: [ROLES_ENUM.ALL],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: '#',
        title: 'Proximamente',
        type: 'link',
        smallTitle: 'AD'
      }
    ]
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
  /* {
    path: '/packages',
    title: 'packages',
    type: 'link',
    icontype: 'fa fa-box',
    role: [ROLES_ENUM.ALL],
  }, */
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
    path: '/self-management/home',
    title: 'Academia',
    type: 'link',
    icontype: 'fa fa-graduation-cap',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '/self-management/withdrawals',
    title: 'Retiros y ganancias',
    type: 'link',
    icontype: 'tim-icons icon-money-coins',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '/referrals',
    title: 'Back office',
    type: 'link',
    icontype: 'tim-icons icon-send',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '#',
    title: 'Señales en Vivo',
    type: 'sub',
    icontype: 'fa-sharp fa-solid fa-ticket',
    role: [ROLES_ENUM.ALL],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: '#',
        title: 'Proximamente',
        type: 'link',
        smallTitle: 'AD'
      },
    ]
  }
  // {
  //   path: '/academy',
  //   title: 'Academia',
  //   type: 'link',
  //   icontype: 
  //   role: [ROLES_ENUM.ALL],
  // },
];

// Routes to TEACHER
export const ROUTES_TEACHER: RouteInfo[] = [
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
    path: '/self-management/home',
    title: 'Academia',
    type: 'link',
    icontype: 'fa fa-graduation-cap',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '/self-management/withdrawals',
    title: 'Retiros y ganancias',
    type: 'link',
    icontype: 'tim-icons icon-money-coins',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '/referrals',
    title: 'Back office',
    type: 'link',
    icontype: 'tim-icons icon-send',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '#',
    title: 'Señales en Vivo',
    type: 'sub',
    icontype: 'fa-sharp fa-solid fa-ticket',
    role: [ROLES_ENUM.ALL],
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: '',
        title: 'Proximamente',
        type: 'link',
        smallTitle: 'AD'
      },
    ]
  }
  // {
  //   path: '/academy',
  //   title: 'Academia',
  //   type: 'link',
  //   icontype: 'fa fa-graduation-cap',
  //   role: [ROLES_ENUM.ALL],
  // },
];

// Routes to USER
export const ROUTES_USER: RouteInfo[] = [
  {
    path: '/referrals',
    title: 'Back office',
    type: 'link',
    icontype: 'tim-icons icon-send',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '/self-management/home',
    title: 'Academia',
    type: 'link',
    icontype: 'fa fa-graduation-cap',
    role: [ROLES_ENUM.ALL],
  },
  {
    path: '/self-management/withdrawals',
    title: 'Retiros y ganancias',
    type: 'link',
    icontype: 'tim-icons icon-money-coins',
    role: [ROLES_ENUM.ALL],
  },
  // {
  //   path: '/academy',
  //   title: 'Academia',
  //   type: 'link',
  //   icontype: 'fa fa-graduation-cap',
  //   role: [ROLES_ENUM.ALL],
  // },
  // {
  //   path: '/billing',
  //   title: 'Facturacion',
  //   type: 'link',
  //   icontype: 'fa-sharp fa-solid fa-ticket',
  //   role: [ROLES_ENUM.ALL],
  // },
  /*   {
      path: '/downloads',
      title: 'descargas',
      type: 'link',
      icontype: 'fa fa-cloud-download-alt',
      role: [ROLES_ENUM.ALL],
    } */
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  packs: any = [
    {
      path: '/packages',
      title: 'paquetes',
      type: 'link',
      icontype: 'fa fa-box',
    }
  ];

  menuItems: any[];
  profileMenuItems: any = [
    {
      path: '/profile',
      title: 'perfil',
      type: 'link',
      icontype: 'tim-icons icon-single-02',
    },
    /*     {
          path: '/customer-service',
          title: 'Servicio al Cliente',
          type: 'link',
          icontype: 'fa fa-headset',
        }, */
  ];

  constructor(private router: Router,
    private userDataService: UserDataService) { }

  public rol: string;

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
