import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AmaService } from '../../../../shared/services/ama.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-ama',
  templateUrl: './ama.component.html',
  styleUrls: ['./ama.component.scss']
})
export class AmaComponent implements OnInit, OnDestroy {

  unansweredQuestion = [];

  subscription1$: Subscription;

  subscriptions: Subscription[] = [];

  constructor(private amaService: AmaService) { }


  getUnansweredQuestions() {

    this.subscription1$ = this.amaService.getUnansweredQuestions().pipe(take(1)).subscribe(res => {
      console.log(res);
      Object.assign(this.unansweredQuestion, res)
    },
      error => {
        console.log('error ' + error.error);
      });
  }

  loadData() {
    this.getUnansweredQuestions();
  }

  ngOnInit(): void {
    this.loadData();

    // Subs
    this.subscriptions.push(this.subscription1$);

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    })
  }

}
