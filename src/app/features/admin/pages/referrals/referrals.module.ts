import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ReferralsComponent } from './referrals.component';

@NgModule({
  declarations: [ReferralsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: ReferralsComponent }]),
    ClipboardModule,
  ],
})
export class ReferralsModule {}
