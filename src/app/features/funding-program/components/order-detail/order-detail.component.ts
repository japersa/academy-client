import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PacksService } from '../../services/packs.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {

  packageId = null;
  package = '';

  constructor(private route: ActivatedRoute,
    private packsService: PacksService) {
  }

  ///retrieve/package/2/
  getPackageById() {
    this.packsService.getPackageById(this.packageId).subscribe(
      {
        next: r => {
          this.package = r;
        },
        error: e => {
          console.log(e);
        }
      }
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.packageId = params.get('id');
      this.getPackageById();
    });
  }

}
