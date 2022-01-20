import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(public toastr: ToastrService) {}
  
  showNotification(from:string, align:string, text:string, color:number) {

    switch (color) {
      case 1:
        this.toastr.info(
          `<span class=" tim-icons icon-bell-55"></span> ${text} `,
          "",
          {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 2:
        this.toastr.success(
          `<span class=" tim-icons icon-bell-55"></span>  ${text}`,          
          "",
          {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 3:
        this.toastr.warning(
          `<span class=" tim-icons icon-bell-55"></span> ${text} `,
          "",
          {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-warning alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 4:
        this.toastr.error(
          `<span class=" tim-icons icon-bell-55"></span> ${text} `,
          "",
          {
            timeOut: 8000,
            enableHtml: true,
            closeButton: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 5:
        this.toastr.show(
          `<span class=" tim-icons icon-bell-55"></span> ${text} `,
          "",
          {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-primary alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      default:
        break;
    }
  }
}
