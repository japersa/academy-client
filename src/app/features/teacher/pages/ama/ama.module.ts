import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { AmaRoutingModule } from './ama-routing.module';
import { AmaComponent } from './ama.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReplyCommentComponent } from './reply-comment/reply-comment.component';


@NgModule({
  declarations: [AmaComponent, ReplyCommentComponent],
  imports: [
    CommonModule,
    AmaRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    QuicklinkModule
  ]
})
export class AmaModule { }
