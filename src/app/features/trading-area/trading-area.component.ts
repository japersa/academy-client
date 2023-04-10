import { Component, OnInit } from '@angular/core';
import { PacksService } from './services/packs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trading-area',
  templateUrl: './trading-area.component.html',
  styleUrls: ['./trading-area.component.scss']
})
export class TradingAreaComponent implements OnInit {

  myPackages: any[] = [];

  constructor(
    private packsService: PacksService,
    private router: Router
  ) { }

  getMypackages() {
    this.packsService.getMyPacks().subscribe(
      response => {
        console.log(response);
        this.myPackages = response;
        console.log(this.myPackages);

      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.getMypackages();
  }
}
