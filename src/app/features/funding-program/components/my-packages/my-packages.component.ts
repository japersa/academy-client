import { Component, OnInit } from '@angular/core';
import { PacksService } from '../../services/packs.service';


@Component({
  selector: 'app-my-packages',
  templateUrl: './my-packages.component.html',
  styleUrls: ['./my-packages.component.scss']
})
export class MyPackagesComponent implements OnInit{

  myPackages: any[] = [];

  constructor (
    private packsServices: PacksService
  ){

  }

  getMypackages() {
    this.packsServices.getMyPacks().subscribe(
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
