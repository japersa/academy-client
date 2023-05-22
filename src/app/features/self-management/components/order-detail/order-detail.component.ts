import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PacksService } from '../../services/packs.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent {

  packageId = null;
  package: any;

  constructor(private route: ActivatedRoute, 
    private packsService: PacksService) {
  }

  ///retrieve/package/2/
  getPackageById() {
    this.packsService.getPackById(this.packageId).subscribe(
      {
        next: r => {
          this.package = r;
          console.log(this.package);
          this.convertBalancesToNumbers();
        },
        error: e => {
          console.log(e);
        }
      }
    );
  }

  convertBalanceToNumber(balance: string): string {
    switch (balance) {
      case 'one_hundred_thousand':
        return '100.000';
      case 'fifty_thousand':
        return '50.000';
      case 'two_hundred_thousand':
        return '200.000';
      case 'five_hundred_thousand':
        return '500.000';
      default:
        throw new Error('Balance string not recognized');
    }
  }

  convertBalancesToNumbers(): void {
      this.package.balance = this.convertBalanceToNumber(this.package.balance);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.packageId = params.get('id');
      this.getPackageById();
    });
   
    
  }

}


