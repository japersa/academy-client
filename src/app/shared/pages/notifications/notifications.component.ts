import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notificaciones = [];

  constructor(
    private notificationsService: NotificationsService
  ) { }

  getNotifications() {

    this.notificationsService.getDBNotifications().subscribe(res => {
      this.notificaciones = res;
    },
      error => {
        console.log('error ' + error.error);
      });
  }

  ngOnInit(): void {
    this.getNotifications();
  }

}
