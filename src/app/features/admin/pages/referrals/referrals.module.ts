import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReferralsComponent } from './referrals.component';

@NgModule({
  declarations: [ReferralsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ReferralsComponent }]),
  ],
})
export class ReferralsModule {}
