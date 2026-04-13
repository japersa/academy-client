import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoursesService } from '../../../../shared/services/courses.service';
import { TopicMediaSocketService } from '../../../../shared/services/topic-media-socket.service';
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

  source: Observable<string | null> = of(null);

  private mediaTickSub: Subscription | null = null;
  private currentTopicId: string | null = null;
  private videoErrorRetries = 0;

  constructor(
    private coursesService: CoursesService,
    public userDataService: UserDataService,
    private router: Router,
    private route: ActivatedRoute,
    private topicMediaSocket: TopicMediaSocketService,
  ) {
  }

  getTopic(topicId: string) {
    this.coursesService.getTopicById(topicId).subscribe(
      {
        next: (res) => {
          console.log(res);
          
          this.topic = res.result;
          this.loadTopicMedia(topicId);
          this.allClass = res.all;
          this.next = res.next.topicID;
          this.previus = res.previus.topicID;
        },
        error: (e) => console.log(e.error),
        complete: () => {

          this.coursesService.markTopicAsSeen(this.topic.id).subscribe(r => console.log(r));

        }
      }
    )
  }

  private clearMediaRefresh() {
    this.mediaTickSub?.unsubscribe();
    this.mediaTickSub = null;
    this.topicMediaSocket.disconnect();
  }

  /** Proxy en el API con token de corta vida; si no, URL directa (legacy). */
  private videoSrcFromMedia(m: {
    video_stream_token?: string | null;
    video_url?: string | null;
  }, topicId: string): string | null {
    if (m.video_stream_token) {
      const base = environment.apiURL.replace(/\/$/, '');
      return `${base}/detail/topics/${topicId}/stream/?t=${encodeURIComponent(m.video_stream_token)}`;
    }
    return m.video_url ?? null;
  }

  private loadTopicMedia(topicId: string) {
    this.clearMediaRefresh();
    this.currentTopicId = topicId;
    this.videoErrorRetries = 0;

    this.coursesService.getTopicMedia(topicId).subscribe({
      next: (m) => {
        this.source = of(this.videoSrcFromMedia(m, topicId));
        this.topic = {
          ...this.topic,
          files: m.files ?? [],
          links: m.links ?? [],
        };
        const sec = m.signed_urls_expires_in_seconds;
        if (sec != null && sec > 30) {
          this.topicMediaSocket.connect(topicId);
          this.mediaTickSub = this.topicMediaSocket.tick$.subscribe(() => {
            if (this.currentTopicId === topicId) {
              this.refreshTopicMediaSilent(topicId);
            }
          });
        }
      },
      error: (e) => {
        console.error(e);
        this.source = of(null);
      },
    });
  }

  /** Misma API; actualiza src del vídeo y enlaces de archivos sin parpadear el tema. */
  private refreshTopicMediaSilent(topicId: string) {
    this.coursesService.getTopicMedia(topicId).subscribe({
      next: (m) => {
        this.source = of(this.videoSrcFromMedia(m, topicId));
        this.topic = {
          ...this.topic,
          files: m.files ?? [],
          links: m.links ?? [],
        };
      },
      error: () => {},
    });
  }

  onVideoError() {
    if (this.videoErrorRetries >= 2 || !this.currentTopicId) {
      return;
    }
    this.videoErrorRetries += 1;
    this.refreshTopicMediaSilent(this.currentTopicId);
  }

  /** Limitar menú contextual / arrastre del vídeo (estilo apps tipo redes sociales). No es DRM. */
  onVideoChromeGuard(event: Event) {
    event.preventDefault();
    event.stopPropagation();
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
      if (id) {
        this.getTopic(id);
      }
    });

  }

  ngOnDestroy(): void {
    this.clearMediaRefresh();
  }


}
