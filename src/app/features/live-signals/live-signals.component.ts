import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { LiveSignalService, LiveSignalStatus } from 'src/app/shared/services/live-signal.service';

@Component({
  selector: 'app-live-signals',
  templateUrl: './live-signals.component.html',
  styleUrls: ['./live-signals.component.scss'],
})
export class LiveSignalsComponent implements OnInit, OnDestroy {
  loading = true;
  status: LiveSignalStatus | null = null;
  safeEmbedUrl: SafeResourceUrl | null = null;
  private sub = new Subscription();

  constructor(
    public userDataService: UserDataService,
    private liveSignalService: LiveSignalService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.liveSignalService.liveSignalStatus$.subscribe((s) => {
        if (s === null) {
          this.loading = true;
          this.status = null;
          this.safeEmbedUrl = null;
          return;
        }
        this.loading = false;
        this.status = s;
        this.safeEmbedUrl =
          s.active && s.embed_url
            ? this.sanitizer.bypassSecurityTrustResourceUrl(s.embed_url)
            : null;
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
