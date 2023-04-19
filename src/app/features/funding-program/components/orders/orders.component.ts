import { Component, OnInit } from '@angular/core';
import { PacksService } from '../../services/packs.service';
import { log } from 'console';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: any[] = null;

  constructor(private packsService: PacksService) { }
 
  ngOnInit(): void {
    this.packsService.getMyOrders().subscribe(
      {
        next: r => {this.orders = r
        console.log(r);
        this.convertBalancesToNumbers();
        }
      }
    );
  }

  convertBalanceToNumber(balance: string): string {
    switch(balance) {
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
    for (const order of this.orders) {
      order.balance = this.convertBalanceToNumber(order.balance);
    }
  }

  
}
