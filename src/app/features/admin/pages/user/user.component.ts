import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-user",
  templateUrl: "user.component.html"
})
export class UserComponent implements OnInit {

  nombre= new FormControl('');
  apellido=new FormControl('');
  email = new FormControl('');
  telefono = new FormControl('');
  //registrationForm: any;
  constructor() {
    //this.nombre = new FormControl('');
  }

  ngOnInit() {
    /*this.registrationForm= new FormGroup({
      nombre : new FormControl(''),
      apellido : new FormControl(''),
      email : new FormControl(''),
      phone : new FormControl('')
    })*/
  }
}
