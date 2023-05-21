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
  loginPack = '0000000';
  passPack = '0000000';
  invesPassPack = '0000000';
  buttonTextLogin = 'Copiar';
  buttonTextPass = 'Copiar';
  buttonTextPassInves = 'Copiar';


  myPackages: any[] = [];
  packSeleted: any;
  packDemo: any;

  modalRef?: BsModalRef;

  constructor(
    private packsService: PacksService,
    private router: Router,
    private modalService: BsModalService,
    public userDataService: UserDataService
  ) { }

  copied(button: string) {

    if (button == 'login') {
      this.buttonTextLogin = 'Copiado';
    } else if (button == 'pass') {
      this.buttonTextPass = 'Copiado';
    } else if (button == 'passInves') {
      this.buttonTextPassInves = 'Copiado';
    }

  }

/*   restoreButtonText() {
    this.modalRef.onHidden.subscribe(() => {
      this.buttonTextLogin = 'Copiar';
      this.buttonTextPass = 'Copiar';
      this.buttonTextPassInves = 'Copiar';
    });
  } */

  getMypackages() {
    this.packsService.getMyPacks().subscribe(
      response => {
        this.myPackages = response;
        console.log(this.myPackages);
        
      },
      error => {
        console.log(error);
      }
    );
  }

  getDemo() {
    this.packsService.getPacksDemo().subscribe(
      pkgDemo => {
        console.log(pkgDemo);
      },
      error => {
        console.log(error);
      }

    )
  }

  show(template: TemplateRef<any>) {

    this.buttonTextLogin = 'Copiar';
    this.buttonTextPass = 'Copiar';
    this.buttonTextPassInves = 'Copiar';

    this.modalRef = this.modalService.show(template);
  }

  showPack(template: TemplateRef<any>, index: number) {
    
    this.buttonTextLogin = 'Copiar';
    this.buttonTextPass = 'Copiar';
    this.buttonTextPassInves = 'Copiar';

    this.modalRef = this.modalService.show(template);
    this.packSeleted = this.myPackages[index];
    this.loginPack = this.packSeleted?.mt_login;
    this.passPack = this.packSeleted?.mt_password;
    this.invesPassPack = this.packSeleted?.mt_password_investor;

  }

 

  ngOnInit(): void {

    this.packsService.getPacksDemo().subscribe(
      pkgDemo => {
        let demo = pkgDemo[0];
        console.log(demo); 
        this.packDemo = demo;
        this.loginDemo = demo?.mt_login;
        this.passDemo = demo?.mt_password;
        this.invesPassDemo = demo?.mt_password_investor;
      },
      error => {
        console.log(error);
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
