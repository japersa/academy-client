import { Component, DestroyRef, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { CoursesService } from '../../../../shared/services/courses.service';
import { RegisterService } from '../../../auth/services/register.service';
import { UserDataService } from '../../../../core/services/user-data.service';
import { StorageService } from '../../../../core/services/storage.service';
import { NotificationsService } from '../../../../core/services/notifications.service';

@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss'], 
  encapsulation: ViewEncapsulation.None,
})
export class AcademyComponent implements OnInit{

  courses = [];
  continueLearningCourses = [];

  packAgActived: any [] = null;
  packAgActive: string = 'Inactivo';

  public dashboardColor: boolean = false;

  slides$ = new BehaviorSubject<any>([]);

  /** Descripción en cards; oculta vacío y placeholder del backend. */
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

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private coursesService: CoursesService,
    private registerService: RegisterService,
    public userDataService: UserDataService,
    private storageService: StorageService,
    private notificationsService: NotificationsService
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

  /** Respaldo si falla el perfil: usa `userData` ya cargado (p. ej. desde storage). */
  fillCourses() {
    this.coursesService.getCourses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      res => {
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
      }
    );
  }

  private applyProfile(r: Record<string, unknown>): void {
    const pkgs = r['packages_self_management'] as { status?: string }[] | undefined;
    this.packAgActived = (pkgs ?? []).filter(pkg => pkg.status === 'active');
    this.agActivete();
    this.userDataService.userData$.next(r);
    void this.storageService.set('userData', r);
    if (r['rol'] === 'user' && r['subscription'] === 'none') {
      this.notificationsService.showNotification(
        'top',
        'center',
        'Aún no tienes una subscripción, puedes obtenerla rápidamente <a href="/subscription">AQUÍ</a>.</p>',
        3
      );
    }
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
      watching: this.coursesService.getKeepWatching(),
      profile: this.registerService.getUser(),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ watching, profile }) => {
          this.continueLearningCourses = watching;
          this.applyProfile(profile as Record<string, unknown>);
        }),
        switchMap(({ profile }) => {
          const p = profile as { rol?: string };
          return this.coursesService.getCourses().pipe(
            tap(res => this.assignCoursesFromPayload(res as Record<string, unknown>, p.rol))
          );
        })
      )
      .subscribe({
        error: e => {
          console.log(e?.error ?? e);
          this.fillCourses();
        },
      });
  }
}
