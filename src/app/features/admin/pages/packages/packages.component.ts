import { Component, OnInit, TemplateRef } from '@angular/core';
import { PackagesService } from '../../services/packages.service';
import { map } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Validators, FormGroup, FormBuilder, } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {

  packages: any[] = [];
  pack: any;
  textButton: string = 'Activar Credenciales'

  selectedStatus: string = '';
  modalRef?: BsModalRef;

  form!: FormGroup;
  validationMessages: any;
  errorMessage: string | null;

  constructor(private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public utilsService: UtilsService,
    private packagesService: PackagesService) {
    this.buildForm();
  }


  get loginField() {
    return this.form?.get('login');
  }

  get loginFieldDirty() {
    return this.loginField?.dirty || this.loginField?.touched;
  }

  get passwordField() { 
    return this.form?.get('password');
  }

  get passwordFieldDirty() {
    return this.passwordField?.dirty || this.passwordField?.touched;
  }

  get passwordInvestorField() {
    return this.form?.get('password_investor');
  }

  get passwordInvestorFieldDirty() {
    return this.passwordInvestorField?.dirty || this.passwordInvestorField?.touched;
  }

  get serverField() {
    return this.form?.get('server');
  }

  get serverFieldDirty() {
    return this.serverField?.dirty || this.serverField?.touched;
  }

  statusChange(selectedStatus: string) {
    this.getPackagesByStatus(selectedStatus);
  }

  getPackagesByStatus(status: string) {
    this.packagesService.getPackages(status).subscribe(
      {
        next: r => {this.packages = r
          this.convertBalancesToNumbers(); 

          console.log(this.packages);
          } 
      })
  }

  convertBalanceToNumber(balance: string): string {
    switch(balance) {
      case 'one_hundred_thousand':
        return '100.000'; 
      case 'fifty_thousand':
        return '50.000';
      case 'two_hundred_thousand':
        return '200.000';
      case 'five_hundred_thousand':
        return '500.000';
      default:
        throw new Error('Balance string not recognized'); 
    }
  }

  convertBalancesToNumbers(): void {
    for (const order of this.packages) {
      order.balance = this.convertBalanceToNumber(order.balance);
    }
  }
  
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      mt_login: ['', [Validators.required]],
      mt_password: ['', [Validators.required]],
      mt_password_investor: ['', [Validators.required]]
    });
  }

  saveCredentials(data: any, id: any) {
    this.packagesService.updatePackage(data, id).subscribe( res => {
        res => console.log(res);
        
        this.statusChange(this.selectedStatus); 
        this.modalRef?.hide()
      },
      error => {
        console.log(error);
        console.log(data.id);
        
      }
    ) 
  } 

  savePackUpdate(form){
    console.log(form);
    this.pack = Object.assign({}, this.pack, form);
    console.log(this.pack);
    console.log(this.pack.id);
    
    this.saveCredentials(form, this.pack.id);
  }

  loadPackInModal(idPack: number, template: TemplateRef<any>){
    this.pack = this.packages.find(pack => pack.id == idPack);
    console.log(this.pack);
    this.openModal(template);
  }

  ngOnInit(): void {
    this.statusChange(this.selectedStatus)
  }

}
