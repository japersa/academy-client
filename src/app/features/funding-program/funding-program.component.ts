import { Component, OnInit, TemplateRef } from '@angular/core';
import { PacksService } from './services/packs.service';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
 
@Component({
  selector: 'app-trading-area',
  templateUrl: './funding-program.component.html',
  styleUrls: ['./funding-program.component.scss']
})
export class FundingProgramComponent implements OnInit {

  referalCode = '0000000'; 
  loginDemo = '0000000'; 
  passDemo = '0000000';
  invesPassDemo = '0000000'; 
  buttonTextLogin = 'Copiar';
  buttonTextPass = 'Copiar';
  buttonTextPassInves = 'Copiar';

 
  myPackages: any[] = [];
  packDemo: any;

  modalRef?: BsModalRef;

  constructor(
    private packsService: PacksService,
    private router: Router,
    private modalService: BsModalService,
    public userDataService: UserDataService
  ) { }

  copied(button: string) {

    if (button == 'login'){
      this.buttonTextLogin = 'Copiado';
    }else if (button == 'pass'){
      this.buttonTextPass = 'Copiado';
    }else if (button == 'passInves'){
      this.buttonTextPassInves = 'Copiado';
    }
    
  }

  getMypackages() {
    this.packsService.getMyPacks().subscribe( 
      response => {
        this.myPackages = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  getDemo(){
    this.packsService.getPacksDemo().subscribe(
       pkgDemo => {
          console.log(pkgDemo);
        }, 
        error  => {
          console.log(error);
        }
    
    )
  }

  show(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit(): void {
    
    this.packsService.getPacksDemo().subscribe(
      pkgDemo => {
         console.log(pkgDemo);
       }, 
       error  => {
         console.log(error);
       }
   )
  
    this.packsService.getPackageDemoById('3').subscribe(
      {
        next: (pkgDemo) => {
          this.packDemo = pkgDemo;
          this.loginDemo = pkgDemo?.mt_login;
          this.passDemo = pkgDemo?.mt_password;
          this.invesPassDemo = pkgDemo?.mt_password_investor;
          console.log(this.packDemo);
          console.log(this.packDemo.length);
        },
        error: (e) => console.log(e)
      }
    )
    
    
    
    this.getMypackages();
    this.userDataService.userData$.subscribe(
      {
       next: (r) => this.referalCode = r?.referral_code
      } 
     );
  }
}
