import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { UserDataService } from '../services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private storageService: StorageService) {
  }

  canActivate() {
    const token = this.storageService.get('isUserLoggedIn');
    if (!token) {
      this.router.navigate(['/sign-in']);
      return false;
    }
  }

}
