import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { buildWhatsAppReferralShareUrl } from 'src/app/shared/utils/referral-share';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { RegisterService } from '../auth/services/register.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { isTeacherOrAdminRole } from 'src/app/shared/utils/staff-role';


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

  /** Alumnos con plan de academia activo (no aplica a profesores ni admins). */
  get hasStudentAcademySubscription(): boolean {
    return (this.userDataService.userData$.value?.subscription || 'none') !== 'none';
  }

  get isTeacherOrAdmin(): boolean {
    const r = this.userDataService.userData$.value?.rol;
    return r === 'teacher' || r === 'admin';
  }

  agActivete() {
    if(this.packAgActived.length > 0){
      this.packAgActive = 'Acivo';
    }
  }

  /** Respaldo si falla la carga agrupada; usa rol ya en `userData$`. */
  fillCourses() {
    this.coursesService.getCourses().subscribe(res => {
      const rol = this.userDataService.userData$.value?.rol;
      if (rol === 'admin') {
        this.courses = res.all ?? [];
      } else if (rol === 'teacher') {
        this.courses = res.my_courses_created ?? [];
      } else if (rol === 'user') {
        this.courses = res.my_enrolled_courses ?? [];
      }
    },
      error => {
        console.log(error);
      });
  }

  private applyUserProfile(r: Record<string, unknown>): void {
    const pkgs = r['packages_self_management'] as { status?: string }[] | undefined;
    this.packAgActived = (pkgs ?? []).filter(pkg => pkg.status === 'active');
    this.agActivete();
    this.userDataService.userData$.next(r);
    this.referalCode = (r['referral_code'] as string) ?? this.referalCode;
    this.referralCodeActive =
      isTeacherOrAdminRole(r['rol'] as string | undefined) || r['referral_active'] === true;
    void this.storageService.set('userData', r);
  }

  private assignCoursesFromPayload(res: Record<string, unknown>, rol: string | undefined): void {
    if (rol === 'admin') {
      this.courses = (res['all'] as unknown[]) ?? [];
    } else if (rol === 'teacher') {
      this.courses = (res['my_courses_created'] as unknown[]) ?? [];
    } else if (rol === 'user') {
      this.courses = (res['my_enrolled_courses'] as unknown[]) ?? [];
    }
  }

  ngOnInit(): void {
    forkJoin({
      profile: this.registerService.getUser(),
      courses: this.coursesService.getCourses(),
      watching: this.coursesService.getKeepWatching(),
    }).subscribe({
      next: ({ profile, courses, watching }) => {
        const p = profile as Record<string, unknown>;
        this.applyUserProfile(p);
        this.continueLearningCourses = watching;
        this.assignCoursesFromPayload(courses as Record<string, unknown>, p['rol'] as string | undefined);
      },
      error: (e) => {
        console.log(e);
        this.registerService.getUser().subscribe({
          next: (r) => {
            this.applyUserProfile(r as Record<string, unknown>);
            forkJoin({
              courses: this.coursesService.getCourses(),
              watching: this.coursesService.getKeepWatching(),
            }).subscribe({
              next: ({ courses, watching }) => {
                this.continueLearningCourses = watching;
                this.assignCoursesFromPayload(courses as Record<string, unknown>, r.rol);
              },
              error: err => {
                console.log(err);
                this.fillCourses();
                this.coursesService.getKeepWatching().subscribe(
                  w => { this.continueLearningCourses = w; },
                  err2 => console.log(err2),
                );
              },
            });
          },
          error: err => console.log(err.error),
        });
      },
    });
  }

}
