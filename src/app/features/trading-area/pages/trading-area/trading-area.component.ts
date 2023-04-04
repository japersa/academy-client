import { Component, OnInit } from '@angular/core';
import { PacksService } from '../../services/packs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trading-area',
  templateUrl: './trading-area.component.html',
  styleUrls: ['./trading-area.component.scss']
})
export class TradingAreaComponent implements OnInit {

  constructor(
    private packsService: PacksService,
    private router: Router
  ) { }

  ngOnInit(): void {
      this.packsService.getMyPacks().subscribe(
        response => {
          if (response.length > 0) {
            this.router.navigate(['trading-area/my-packages']);
          }
        },
        error => {
          console.log(error);
        }
      )
  }
}
