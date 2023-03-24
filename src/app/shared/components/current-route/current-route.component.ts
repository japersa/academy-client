import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-current-route',
  templateUrl: './current-route.component.html',
  styleUrls: ['./current-route.component.scss']
})
export class CurrentRouteComponent {

  route: any;

  constructor(private router: Router) {
    console.log(router.url);

    // router.events
    //   .subscribe(event => {
    //     console.log(event);
    //     this.route = event;
    //   });
  }
}
