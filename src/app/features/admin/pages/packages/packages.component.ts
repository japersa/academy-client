import { Component, OnInit } from '@angular/core';
import { PackagesService } from '../../services/packages.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {

  packages: any[] = [];

  constructor(private packagesService: PackagesService) { }

  getPackakes(status?: any) {
    this.packagesService.getPackages().pipe(
      map(packs => packs.map(item => {
        return {
          ...item,
          balance: this.balanceToNumber(item.balance)
        }
      }))
    ).subscribe(
      {
        next: (r) => this.packages = r,
        error: (e) => console.log(e)
      }
    );
  }

  balanceToNumber(balance: string) {
    switch (balance) {
      case 'fifty_thousand':
        return '$ 50.000';
      case 'one_hundred_thousand':
        return '$ 100.000';
      case 'two_hundred_thousand':
        return '$ 200.000';
      case 'five_hundred_thousand':
        return '$ 500.000';
      default:
        return '';
    }
  }

  ngOnInit(): void {
    this.getPackakes();
  }

}
