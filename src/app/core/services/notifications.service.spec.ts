import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { NotificationsService } from './notifications.service';
import { UserEventsService } from './user-events.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserEventsService,
          useValue: { notificationNew$: new Subject() },
        },
      ],
    });
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
