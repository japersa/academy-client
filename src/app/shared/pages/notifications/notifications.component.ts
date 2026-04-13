import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../../../core/services/notifications.service';
import { UserDataService } from '../../../core/services/user-data.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  notificaciones = [];
  private incomingSub?: Subscription;

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
    this.incomingSub = this.notificationsService.notificationIncoming$.subscribe(() => {
      this.getNotifications();
    });
  }

  ngOnDestroy(): void {
    this.incomingSub?.unsubscribe();
  }

}
