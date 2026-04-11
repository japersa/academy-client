import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../../../features/admin/components/sidebar/sidebar.component';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

var misc: any = {
  sidebar_mini_active: true
};
@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss']
})
export class AuthNavbarComponent implements OnInit {
  isCollapsed = true;
  private listTitles: any[];
  location: Location;

  constructor(location: Location,
    public toastr: ToastrService,
    private router: Router) {
    this.location = location;
  }
  minimizeSidebar() {
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('sidebar-mini')) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove('sidebar-mini');
      misc.sidebar_mini_active = false;
      this.showSidebarMessage('Sidebar mini deactivated...');
    } else {
      body.classList.add('sidebar-mini');
      this.showSidebarMessage('Sidebar mini activated...');
      misc.sidebar_mini_active = true;
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }
  showSidebarMessage(message: string) {
    this.toastr.error(message, '', {
      timeOut: 4000,
      closeButton: true,
      positionClass: 'toast-top-right',
    });
  }
  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
  }

  /** Sin [collapse] de ngx-bootstrap: evita aria-hidden con hijo enfocado (Chrome WAI-ARIA). */
  onToggleNavbar() {
    const menu = document.getElementById('authNavbarMenu');
    const hadFocusInside =
      typeof document !== 'undefined' &&
      document.activeElement instanceof HTMLElement &&
      menu?.contains(document.activeElement);
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed && hadFocusInside) {
      document.getElementById('authNavbarMenuToggle')?.focus();
    }
  }
}
