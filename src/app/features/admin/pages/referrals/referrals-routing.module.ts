import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferralsComponent } from './referrals.component';
import { ReferralRebuyCheckoutComponent } from './referral-rebuy-checkout/referral-rebuy-checkout.component';

const routes: Routes = [
  { path: '', component: ReferralsComponent },
  { path: 'rebuy-checkout', component: ReferralRebuyCheckoutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferralsRoutingModule {}
