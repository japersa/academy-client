import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { CoursesService } from '../../../../shared/services/courses.service';
import { UserDataService } from '../../../../core/services/user-data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit, OnDestroy {

  topicId = '';
  topic: any = {};

  profileUrl: Observable<string | null>;
  source = '';

  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscriptions: Subscription[] = [];

  constructor(
    private storage: AngularFireStorage,
    private coursesService: CoursesService,
    public userDataService: UserDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    const ref = this.storage.ref('/mistrades/uploads/courses/videos/3i34sgg47t8');
    this.profileUrl = ref.getDownloadURL();

    this.profileUrl.subscribe(res => this.source = res)

  }

  getTopic(topicId: string) {
    this.subscription2$ = this.coursesService.getTopicById(topicId).subscribe(res => {
      Object.assign(this.topic, res[0])
    },
      error => {
        console.log(error.error);
      }
    );


  }

  ngOnInit(): void {

    this.subscription1$ = this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      console.log(id);
      this.getTopic(id);
    });

  }

  ngOnDestroy(): void {

    this.subscriptions.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    })
  }


}
