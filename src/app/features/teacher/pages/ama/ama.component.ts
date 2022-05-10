import { Component, OnInit, OnDestroy } from '@angular/core';
import { AmaService } from '../../../../shared/services/ama.service';

@Component({
  selector: 'app-ama',
  templateUrl: './ama.component.html',
  styleUrls: ['./ama.component.scss']
})
export class AmaComponent implements OnInit, OnDestroy {

  unansweredQuestion = [];

  constructor(private amaService: AmaService,
  ) { }

  getUnansweredQuestions() {

    this.amaService.getUnansweredQuestions().subscribe(res => {
      Object.assign(this.unansweredQuestion, res);
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
  }

  ngOnDestroy(): void {
  }

}
