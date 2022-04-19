import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {

  profileUrl: Observable<string | null>;
  source = '';
  constructor(private storage: AngularFireStorage) {
     const ref = this.storage.ref('/mistrades/uploads/courses/videos/3i34sgg47t8');
     this.profileUrl = ref.getDownloadURL();
    this.profileUrl.subscribe( res => this.source = res
     )
     
  }

  ngOnInit(): void {
  }
  

}
