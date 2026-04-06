import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { StripeModule } from 'stripe-angular';
import { environment } from 'src/environments/environment';
import { ReferralsComponent } from './referrals.component';

@NgModule({
  declarations: [ReferralsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ReferralsComponent }]),
    ClipboardModule,
    StripeModule.forRoot(environment.stripePK),
  ],
})
export class ReferralsModule {}
