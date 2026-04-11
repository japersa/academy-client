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
    private liveSignalService: LiveSignalService,
    private sanitizer: DomSanitizer,
    public userDataService: UserDataService,
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.liveSignalService.getStatus().subscribe({
        next: (s) => {
          this.status = s;
          this.safeEmbedUrl =
            s.active && s.embed_url
              ? this.sanitizer.bypassSecurityTrustResourceUrl(s.embed_url)
              : null;
          this.loading = false;
        },
        error: () => {
          this.status = { active: false };
          this.loading = false;
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
