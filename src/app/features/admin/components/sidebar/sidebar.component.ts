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
