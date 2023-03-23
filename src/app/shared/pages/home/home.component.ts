import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { UserDataService } from '../../../core/services/user-data.service';
import { BehaviorSubject, Subscription } from 'rxjs';

import SwiperCore, { Keyboard, Pagination, Navigation, Virtual } from 'swiper';
import { NotificationsService } from '../../../core/services/notifications.service';
import { RegisterService } from '../../../features/auth/services/register.service';
import { StorageService } from '../../../core/services/storage.service';
SwiperCore.use([Keyboard, Pagination, Navigation, Virtual]);


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
