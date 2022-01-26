import { UserDataService } from './../../../core/services/user-data.service';
import { take } from 'rxjs/operators';
import { NotificationsService } from './../../../core/services/notifications.service';
import { UtilsService } from './../../../core/services/utils.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from "@angular/core";
import { EditUserService } from '../../services/edit-user.service';


@Component({
  selector: "app-user",
  templateUrl: "user.component.html"
})
export class UserComponent implements OnInit {

  //two way data binding
  first_name= new FormControl('');
  last_name=new FormControl('');
  username = new FormControl('');
  phone_number = new FormControl('');

  public rol;
  showPasswordField:boolean=false;
  showButtonPassword:boolean=true;


  updateForm: FormGroup;
  updatePasswordForm: FormGroup;
  validationMessages: any;
  errorMessage: string | null;

  subscription$: Subscription;

  focus;
  focus1;
  focus2;
  focus4;

  constructor(private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    public notificationService: NotificationsService,
    private editUserService: EditUserService, 
    public userDataService: UserDataService) {
    this.validationMessages = utilsService.getValidationMessages();

    this.updateForm = this.formBuilder.group({
      first_name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)])),
      last_name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)])),
    }
    );
  }

  showUpdatePassword(){
    if(this.showPasswordField==true){
      this.showPasswordField=false;
      this.showButtonPassword=true;
      this.updatePasswordForm.reset();
    } else if(this.showPasswordField==false){
      this.showPasswordField=true;
      this.showButtonPassword=false;
    }
  }

  setRol(rolLocal){
    if(rolLocal=='"student"'){
      this.rol = "Estudiante";
    } else if(rolLocal=='"teacher"'){
      this.rol = "Profesor";
    } else if(rolLocal=='"admin"') {
      this.rol = "Administrador"
    }
    return this.rol;
  }

  updateUser(dataFrom: any){
    const data = {
      first_name: dataFrom.first_name,
      last_name: dataFrom.last_name,
      username: dataFrom.email,
      phone_number: dataFrom.phone_number,
    }
    this.subscription$ = this.editUserService.updateUser(data).pipe(take(1)).subscribe(res => {
      console.log(res);
      this.notificationService.showNotification('bottom','center','Has actualizado los datos correctamente',2);
      this.updateForm.reset();
    },
      error => {
        this.errorMessage = error.error;
        console.log(error.error);
        this.notificationService.showNotification('bottom','center','Error al actualizar usuario',4);
      });
  }



  updatePassword(dataFrom: any){
    const data = {
      password: dataFrom.password
    }
    this.subscription$ = this.editUserService.updateUser(data).pipe(take(1)).subscribe(res => {
      console.log(res);
      this.notificationService.showNotification('bottom','center','Has actualizado los datos correctamente',2);
      this.updatePasswordForm.reset();
      this.showUpdatePassword();
    },
      error => {
        this.errorMessage = error.error;
        console.log(error.error);
        this.notificationService.showNotification('bottom','center','Error al actualizar usuario',4);
      });
  }

  ngOnInit() {
    this.setRol(localStorage.userData.split(',')[4].split(':')[1].split('}')[0]);
    console.log(this.rol)
    console.log(localStorage.userData.split(',')[4].split(':')[1].split('}')[0])
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('register-page');
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('register-page');
  }
}
