import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  source: any = null;

  constructor(private sanitizer: DomSanitizer) {
    this.source = this.sanitizer.bypassSecurityTrustResourceUrl('https://firebasestorage.googleapis.com/v0/b/mistrades-b043d.appspot.com/o/y2mate.com%20-%20Linkin%20Park%20feat%20Travis%20Barker%20%20Bleed%20It%20Out_480p.mp4?alt=media&token=df12c13b-7e0a-4fa8-956a-d5ff9dacfee5');
  }

  ngOnInit(): void {
  }

}
