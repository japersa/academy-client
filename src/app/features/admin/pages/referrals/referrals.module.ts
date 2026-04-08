import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReferralsComponent } from './referrals.component';
import { ReferralRebuyCheckoutComponent } from './referral-rebuy-checkout/referral-rebuy-checkout.component';
import { ReferralsRoutingModule } from './referrals-routing.module';

@NgModule({
  declarations: [ReferralsComponent, ReferralRebuyCheckoutComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReferralsRoutingModule,
    ClipboardModule,
    ModalModule,
  ],
})
export class ReferralsModule {}
