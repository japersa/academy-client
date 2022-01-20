import { Component } from "@angular/core";
import { UserDataService } from './core/services/user-data.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {

  constructor(private userDataService: UserDataService) {
    this.userDataService.loadStorageUserData();
  }

}
