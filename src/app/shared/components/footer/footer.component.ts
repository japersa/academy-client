import { Component, OnInit } from "@angular/core";
import { UserDataService } from '../../../core/services/user-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"]
})
export class FooterComponent implements OnInit {
  readonly currentYear = new Date().getFullYear();
  readonly publicWebsiteUrl = environment.publicWebsiteUrl;

  constructor(public userDataService: UserDataService) {}

  ngOnInit(): void {}
}
