import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { buildWhatsAppReferralShareUrl } from 'src/app/shared/utils/referral-share';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { RegisterService } from '../auth/services/register.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-self-management',
  templateUrl: './self-management.component.html',
  styleUrls: ['./self-management.component.scss']
})
export class SelfManagementComponent implements OnInit {

  referalCode = '0000000';
  referralCodeActive = false;
  buttonText = 'Copiar';

  courses = [];
  continueLearningCourses = [];

  packAgActived: any [] = null;
  packAgActive: string = 'Inactivo';

  public dashboardColor: boolean = false;

  slides$ = new BehaviorSubject<any>([]);

  onReferralCodeCopied(success: boolean, updateCommissionsButton = false): void {
    if (success) {
      this.toastr.success('Código copiado al portapapeles.', 'Copiado');
      if (updateCommissionsButton) {
        this.buttonText = 'Copiado';
      }
    } else {
      this.toastr.warning('No se pudo copiar. Intenta de nuevo o copia manualmente.', 'Copiar');
    }
  }

  get whatsappReferralHref(): string {
    return buildWhatsAppReferralShareUrl(this.referalCode);
  }

  /** Descripción visible en cards; oculta vacío y placeholder del backend. */
  courseCardDescription(c: {
    topic_description?: string;
    course_description?: string;
    description?: string;
  }): string | null {
    const raw = String(
      c?.topic_description ?? c?.course_description ?? c?.description ?? ''
    ).trim();
    if (!raw || raw === 'Sin asignar') {
      return null;
    }
    return raw;
  }


  constructor(public userDataService: UserDataService,
              private coursesService: CoursesService,
              private registerService: RegisterService,
              private storageService: StorageService,
              private toastr: ToastrService,
  ) { }

  agActivete() {
    if(this.packAgActived.length > 0){
      this.packAgActive = 'Acivo';
    }
  }

  fillCourses() {
    this.coursesService.getCourses().subscribe(res => {

      if (this.userDataService.userData$.value.rol === 'admin') {
        this.courses = res.all;
      }
      if (this.userDataService.userData$.value.rol === 'teacher') {
        this.courses = res.my_courses_created;
      }
      if (this.userDataService.userData$.value.rol === 'user') {
        this.courses = res.my_enrolled_courses;
      }
    },
      error => {
        console.log(error);
      });
  }

  getUser() {
    setTimeout(() => {
      this.registerService.getUser().subscribe(
        {
          next: (r) => {
            this.packAgActived = r.packages_self_management.filter(pkg => pkg.status === 'active');
            this.agActivete();
            this.userDataService.userData$.next(r);
            this.referalCode = r?.referral_code;
            this.referralCodeActive = r?.referral_active === true;
            this.storageService.set('userData', r);
          },
          error: (e) => {
            console.log(e.error);
          }
        }
      )
    }, 200);
  }

  ngOnInit(): void {
    /* this.userDataService.userData$.subscribe(
     {
      next: (r) => this.referalCode = r?.referral_code
     } 
    ); */

    this.fillCourses();
    this.coursesService.getKeepWatching().subscribe(r => {
      this.continueLearningCourses = r;
    });
    this.getUser();

  }

}
