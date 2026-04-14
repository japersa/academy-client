import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ROLES_ENUM } from 'src/app/shared/enum/roles.enum';
import {
  referralCodePillKind,
  referralCodePillLabel,
} from 'src/app/shared/utils/referral-code-status';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { EMPTY, merge } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-admins',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  bsRangeValue: Date[] = null;

  bsConfig?: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-default',
    dateInputFormat: 'YYYY-MM-DD',
    useUtc: true,
    showClearButton: true
  };

  @ViewChild('search') input!: ElementRef;

  userEdit = {};
  showFormCreateUser = false;
  showFormEditUser = false;
  role: ROLES_ENUM = undefined;

  rows: any[] = [];
  /** Filas mostradas (tras búsqueda); la paginación opera sobre esto. */
  temp: any[] = [];
  entries = 10;
  /** Página actual (1-based) cuando entries !== -1 */
  currentPage = 1;

  listError: string | null = null;
  loading = false;

  options: Record<string, string> = {};

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) { }

  private roleFromRouteTree(): string | null {
    let r: ActivatedRoute | null = this.route;
    while (r) {
      const role = r.snapshot.paramMap.get('role');
      if (role) {
        return role;
      }
      r = r.parent;
    }
    return null;
  }

  /** Filas de la página actual (tabla HTML; sin ngx-datatable). */
  get pagedRows(): any[] {
    if (this.entries === -1) {
      return this.temp;
    }
    const ps = this.entries;
    const start = (this.currentPage - 1) * ps;
    return this.temp.slice(start, start + ps);
  }

  get totalPages(): number {
    if (this.entries === -1 || this.temp.length === 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(this.temp.length / this.entries));
  }

  /** Inicio inclusivo en UI (1-based índice humano del primer registro) */
  get rangeStart(): number {
    if (this.temp.length === 0) {
      return 0;
    }
    if (this.entries === -1) {
      return 1;
    }
    return (this.currentPage - 1) * this.entries + 1;
  }

  get rangeEnd(): number {
    if (this.temp.length === 0) {
      return 0;
    }
    if (this.entries === -1) {
      return this.temp.length;
    }
    return Math.min(this.currentPage * this.entries, this.temp.length);
  }

  /** Título de la card: español, mismo criterio que el resto de vistas admin (sin mayúsculas ni inglés). */
  get roleTitleEs(): string {
    switch (this.role) {
      case ROLES_ENUM.ADMIN:
        return 'Administradores';
      case ROLES_ENUM.TEACHER:
        return 'Profesores';
      case ROLES_ENUM.USER:
        return 'Usuarios';
      default:
        return 'Usuarios';
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  referralPillKind(row: {
    referral_code?: string;
    rol?: string;
    referral_active?: boolean;
  }): ReturnType<typeof referralCodePillKind> {
    return referralCodePillKind(row);
  }

  referralPillLabel(row: {
    referral_code?: string;
    rol?: string;
    referral_active?: boolean;
  }): string {
    return referralCodePillLabel(referralCodePillKind(row));
  }

  /**
   * Cédula del patrocinador (dueño del código en autogestión), no el documento diferido del usuario.
   * Coincide con `referral_code_owner_identity_card` del detalle de paquete.
   */
  referralSponsorIdentityCard(row: {
    packages_self_management?: Array<{ referral_code_owner_identity_card?: string | null }>;
  }): string {
    const packs = row?.packages_self_management;
    if (!Array.isArray(packs)) {
      return '';
    }
    for (const p of packs) {
      const v = p?.referral_code_owner_identity_card;
      if (v != null && String(v).trim() !== '') {
        return String(v).trim();
      }
    }
    return '';
  }

  private normalizeUserListResponse(body: unknown): any[] {
    if (Array.isArray(body)) {
      return body;
    }
    if (body && typeof body === 'object') {
      const o = body as { results?: unknown; data?: unknown };
      if (Array.isArray(o.results)) {
        return o.results;
      }
      if (Array.isArray(o.data)) {
        return o.data;
      }
    }
    return [];
  }

  private applyRowsToTemp(): void {
    this.temp = this.rows.map((prop: any, key: number) => ({
      ...prop,
      idx: key,
    }));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
  }

  createUser() {
    this.showFormCreateUser = !this.showFormCreateUser;
  }

  editUser(user: object) {
    this.userEdit = user;
    this.showFormCreateUser = false;
    this.showFormEditUser = true;
  }

  changeStateShow(value: boolean) {
    this.showFormCreateUser = value;
    this.showFormEditUser = value;
  }

  filterTable($event: any) {
    const val = ($event.target.value || '').toString().toLowerCase().trim();
    if (!val) {
      this.applyRowsToTemp();
      this.currentPage = 1;
      return;
    }
    const filtered = this.rows.filter((d: any) => {
      if (this.referralSponsorIdentityCard(d).toLowerCase().indexOf(val) !== -1) {
        return true;
      }
      for (const key in d) {
        if (!Object.prototype.hasOwnProperty.call(d, key)) {
          continue;
        }
        const cell = d[key] != null ? String(d[key]) : '';
        if (cell.toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
    this.temp = filtered.map((prop: any, key: number) => ({
      ...prop,
      idx: key,
    }));
    this.currentPage = 1;
  }

  getUsers() {
    this.loading = true;
    this.listError = null;
    this.dashboardService.getUsersByRole(this.options).subscribe({
      next: r => {
        this.rows = this.normalizeUserListResponse(r);
        this.rows.forEach((e: any) => (e['demo_package'] = 'null'));
        this.currentPage = 1;
        this.applyRowsToTemp();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.loading = false;
        this.rows = [];
        this.temp = [];
        const msg =
          err?.error?.detail ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null);
        this.listError =
          msg || `No se pudo cargar usuarios (${err?.status ?? '?'})`;
        this.cdr.markForCheck();
      },
    });
  }

  entriesChange($event: Event) {
    const raw = ($event.target as HTMLSelectElement).value;
    const n = parseInt(raw, 10);
    this.entries = Number.isNaN(n) ? 10 : n;
    this.currentPage = 1;
  }

  resetFilters() {
    this.entries = 10;
    if (this.role != null) {
      this.options['rol'] = String(this.role);
    } else {
      delete this.options['rol'];
    }
    this.bsRangeValue = null;
    delete this.options['since'];
    delete this.options['until'];
    this.currentPage = 1;
    this.getUsers();
  }

  deleteUser(userId: string | number | undefined) {
    if (userId === undefined || userId === null) {
      return;
    }
    const id = String(userId);
    swal
      .fire({
        title: 'Estas seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Sí, bórralo!',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn btn-success mr-1',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false
      })
      .then(result => {
        if (result.isConfirmed) {
          this.dashboardService.deleteUser(id).subscribe({
            next: () => {
              this.getUsers();
              swal.fire({
                title: 'Eliminado!',
                text: 'La orden ha sido ejecutada',
                icon: 'success',
                customClass: {
                  confirmButton: 'btn btn-success',
                },
                buttonsStyling: false
              });
            },
            error: error => {
              console.log('error ' + error.error);
            }
          });
        } else {
          swal.fire({
            title: 'Cancelado',
            text: 'No hemos eliminado nada :)',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-info',
            },
            buttonsStyling: false
          });
        }
      });
  }

  onValueChange(value: Date[]): void {
    if (value) {
      const date = value.map(item => item.toISOString());
      this.options['since'] = date[0];
      this.options['until'] = date[1];
      this.getUsers();
    }
  }

  ngOnInit(): void {
    const paramMaps$ = merge(
      this.route.paramMap,
      this.route.parent ? this.route.parent.paramMap : EMPTY,
    );

    paramMaps$
      .pipe(
        map(() => this.roleFromRouteTree()),
        distinctUntilChanged(),
      )
      .subscribe(role => {
        if (role) {
          this.role = role as ROLES_ENUM;
          this.options['rol'] = role;
        } else {
          this.role = undefined;
          delete this.options['rol'];
        }
        this.showFormCreateUser = false;
        this.showFormEditUser = false;
        this.userEdit = {};
        this.getUsers();
      });
  }
}
