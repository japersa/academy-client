import { Component, OnInit } from '@angular/core';
import { PacksService } from '../../services/packs.service';

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
        }
      }
    );
  }

}
