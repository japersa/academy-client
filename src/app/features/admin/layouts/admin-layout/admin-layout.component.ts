import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import PerfectScrollbar from "perfect-scrollbar";
import { ToastrService } from "ngx-toastr";
import { UserDataService } from '../../../../core/services/user-data.service';
import { LiveSignalService } from 'src/app/shared/services/live-signal.service';
import { UserEventsService } from 'src/app/core/services/user-events.service';

var misc: any = {
  sidebar_mini_active: true
};

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"]
})
export class AdminLayoutComponent implements OnInit {
  constructor(public router: Router,
    public userDataService: UserDataService,
    public toastr: ToastrService,
    private liveSignalService: LiveSignalService,
    private userEventsService: UserEventsService,
  ) { }
  @HostListener("window:scroll", ["$event"])
  showNavbarButton = () => {
    var mainPanel: any = document.getElementsByClassName("main-panel")[0];
    var navbarMinimize: any = document.getElementsByClassName(
      "navbar-minimize-fixed"
    )[0];

    if (
      document.documentElement.scrollTop > 50 ||
      document.scrollingElement.scrollTop > 50 ||
      mainPanel.scrollTop > 50
    ) {
      navbarMinimize.style.opacity = 1;
    } else if (
      document.documentElement.scrollTop <= 50 ||
      document.scrollingElement.scrollTop <= 50 ||
      mainPanel.scrollTop <= 50
    ) {
      navbarMinimize.style.opacity = 0;
    }
  };

  ngOnInit() {
    var mainPanel: any = document.getElementsByClassName("main-panel")[0];
    var sidebar: any = document.getElementsByClassName("sidebar-wrapper")[0];

    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      var ps = new PerfectScrollbar(mainPanel);
      ps = new PerfectScrollbar(sidebar);
      var tables: any = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    this.showNavbarButton();
    this.liveSignalService.startPolling();
    this.userEventsService.start();
  }
  minimizeSidebar() {
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("sidebar-mini")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove("sidebar-mini");
      misc.sidebar_mini_active = false;
      this.showSidebarMessage("Sidebar mini deactivated...");
    } else {
      body.classList.add("sidebar-mini");
      this.showSidebarMessage("Sidebar mini activated...");
      misc.sidebar_mini_active = true;
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event("resize"));
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
}
