import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils.service';
import { PacksService } from '../../services/packs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-demo',
  templateUrl: './create-demo.component.html',
  styleUrls: ['./create-demo.component.scss']
})
export class CreateDemoComponent {

  price = '';
  form!: FormGroup;
  errorMessage: string | null;
/*   newPack: any [] = null; */

  constructor(
    // import the form builder
    private formBuilder: FormBuilder,
    public utilsService: UtilsService,
    private packsService: PacksService,
    private router: Router
  ) {
    // Build the form
    this.buildForm();
  }

  // create the form
  private buildForm() {
    this.form = this.formBuilder.group({
      balance: ['', [Validators.required]],
      currencies: [{value:'usd', disabled: true}],
      account_type: [{value:'euro_street_full', disabled: true}],
    });
  }

  createPack(formData: any) {
    console.log(formData);
    
    this.packsService.createPackDemo(formData).subscribe( pkg => {
      console.log(pkg);
    } );
  }
}
 