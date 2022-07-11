import { Component, OnInit } from "@angular/core";
import { UserDataService } from '../../../core/services/user-data.service';

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"]
})
export class FooterComponent implements OnInit {
  test: Date = new Date();

  constructor(public userDataService: UserDataService) {}

  ngOnInit() {}
}
