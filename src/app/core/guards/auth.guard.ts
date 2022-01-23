import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  logged = false;

  constructor(private router: Router,
    private storageService: StorageService) {
    this.logged = this.storageService.get('isUserLoggedIn');
    console.log(this.logged);

  }

  canActivate() {
    if (this.logged) {
      return true;
    } else {
      this.router.navigate(['/sign-in']);
    }
  }

}
