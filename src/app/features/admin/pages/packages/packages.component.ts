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

  getPackakes(status?: any) {
    this.packagesService.getPackages().pipe(
      map(packs => packs.map(item => {
        return {
          ...item,
          balance: this.balanceToNumber(item.balance)
        }
      }))
    ).subscribe(
      {
        next: (r) => this.packages = r,
        error: (e) => console.log(e)
      }
    );
  }

  balanceToNumber(balance: string) {
    switch (balance) {
      case 'fifty_thousand':
        return '$ 50.000';
      case 'one_hundred_thousand':
        return '$ 100.000';
      case 'two_hundred_thousand':
        return '$ 200.000';
      case 'five_hundred_thousand':
        return '$ 500.000';
      default:
        return '';
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password_investor: ['', [Validators.required]],
      server: ['', [Validators.required]],
    });
  }

  saveCredentials(event: any) {
    console.log(this.form.value);
  }

  ngOnInit(): void {
    this.getPackakes();
  }

}
