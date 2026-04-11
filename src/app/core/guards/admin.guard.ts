import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';

/**
 * Solo usuarios con rol `admin`. El resto se redirige a Back office.
 */
@Injectable({ providedIn: 'root' })
export class AdminGuard {
  constructor(
    private router: Router,
    private userDataService: UserDataService,
  ) {}

  canActivate(): boolean {
    const rol = this.userDataService.userData$?.value?.rol;
    if (rol === 'admin') {
      return true;
    }
    this.router.navigate(['/referrals']);
    return false;
  }
}
