import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../../core/services/notifications.service';
import { UserDataService } from '../../../core/services/user-data.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notificaciones = [];

  constructor(
    private notificationsService: NotificationsService,
    public userDataService: UserDataService
  ) { }

  getNotifications() {

    this.notificationsService.getDBNotifications().subscribe(res => {
      this.notificaciones = res;
      console.log(res);

    },
      error => {
        console.log('error ' + error.error);
      });
  }

  ngOnInit(): void {
    this.getNotifications();
  }

}
