import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  logged = false;

  constructor(private router: Router, private userDataService: UserDataService) {
    this.logged = this.userDataService.getLoggedIn();
  }

  canActivate() {
    if (this.logged) {
      return true;
    } else {
      this.router.navigate(['/sign-in']);
    }
  }

}
