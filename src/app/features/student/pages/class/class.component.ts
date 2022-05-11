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

  topic: any = {};

  allClass = [];
  next = '';
  previus = '';

  source: Observable<string | null>;

  constructor(
    private storage: AngularFireStorage,
    private coursesService: CoursesService,
    public userDataService: UserDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  getTopic(topicId: string) {
    this.coursesService.getTopicById(topicId).subscribe(
      {
        next: (res) => {
          this.topic = res.result
          this.getVideo(res.result.video);
          Object.assign(this.allClass, res.all);
          this.next = res.next.topicID;
          this.previus = res.previus.topicID;
        },
        error: (e) => console.log(e.error),
        complete: () => {

          if (this.topic.seen === false) {
            this.coursesService.masrkTopicAsSeen(this.topic.id).subscribe();
          }

        }
      }
    )
  }

  getVideo(url: string) {
    const ref = this.storage.ref(url);
    this.source = ref.getDownloadURL();
  }

  nextClass() {
    this.router.navigate(['/class/', this.next]);
  }
  previusClass() {
    this.router.navigate(['/class/', this.previus]);
  }
  seeCourse() {
    this.router.navigate(['/course/', this.topic.course_id]);
  }
  setClass(id) {
    this.router.navigate(['/class/', id]);
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.getTopic(id);
    });



  }

  ngOnDestroy(): void {
  }


}
