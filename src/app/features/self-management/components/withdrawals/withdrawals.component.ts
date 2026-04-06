import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/shared/services/user.service';

const apiURL = environment.apiURL.replace(/\/$/, '');

/** Obligatorio: al menos un carácter distinto de espacio (TRC20). */
function walletNoteRequired(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = (control.value ?? '').toString().trim();
    return v.length ? null : { walletNoteRequired: true };
  };
}

export interface CommissionWithdrawalRow {
  id: number;
  amount: string;
  status: string;
  user_note: string;
  created_at: string;
}

export interface PointsWithdrawalRow {
  id: number;
  amount: number;
  status: string;
  user_note: string;
  created_at: string;
}

export type WithdrawalKind = 'commission' | 'points';

@Component({
  selector: 'app-withdrawals',
  templateUrl: './withdrawals.component.html',
  styleUrls: ['./withdrawals.component.scss']
})
export class WithdrawalsComponent implements OnInit {
  commissionBalance: number = 0;
  travelPoints: number = 0;
  loadingBalance = true;
  submittingCommission = false;
  submittingPoints = false;
  commissionRequests: CommissionWithdrawalRow[] = [];
  pointsRequests: PointsWithdrawalRow[] = [];
  withdrawalType: WithdrawalKind = 'commission';

  commissionForm = this.fb.group({
    amount: [
      null as number | null,
      [Validators.required, Validators.min(0.01)],
    ],
    user_note: ['', [walletNoteRequired(), Validators.maxLength(2000)]],
  });

  pointsForm = this.fb.group({
    amount: [
      null as number | null,
      [Validators.required, Validators.min(1)],
    ],
    user_note: ['', [walletNoteRequired(), Validators.maxLength(2000)]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab === 'points') {
      this.withdrawalType = 'points';
    } else if (tab === 'commission') {
      this.withdrawalType = 'commission';
    }
    this.refreshBalancesAndRequests();
  }

  setWithdrawalType(t: WithdrawalKind): void {
    this.withdrawalType = t;
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pendiente',
      approved: 'Aprobada',
      rejected: 'Rechazada',
      paid: 'Pagada',
    };
    return map[status] ?? status;
  }

  statusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'badge badge-warning text-dark',
      approved: 'badge badge-info',
      rejected: 'badge badge-danger',
      paid: 'badge badge-success',
    };
    return map[status] ?? 'badge badge-secondary';
  }

  refreshBalancesAndRequests(): void {
    this.loadingBalance = true;
    this.userService.getUser().subscribe({
      next: (user) => {
        this.commissionBalance = Number(user?.commission_balance ?? 0);
        this.travelPoints = Number(user?.travel_points ?? 0);
        this.loadingBalance = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingBalance = false;
        this.toastr.error('No se pudo cargar el saldo.', 'Retiros');
      },
    });

    this.http.get<CommissionWithdrawalRow[]>(`${apiURL}/commission-withdrawal/my`).subscribe({
      next: (rows) => {
        this.commissionRequests = Array.isArray(rows) ? rows : [];
      },
      error: (err) => {
        console.error(err);
        this.commissionRequests = [];
      },
    });

    this.http.get<PointsWithdrawalRow[]>(`${apiURL}/points-withdrawal/my`).subscribe({
      next: (rows) => {
        this.pointsRequests = Array.isArray(rows) ? rows : [];
      },
      error: (err) => {
        console.error(err);
        this.pointsRequests = [];
      },
    });
  }

  requestCommissionWithdrawal(): void {
    if (this.commissionForm.invalid || this.submittingCommission) {
      this.commissionForm.markAllAsTouched();
      return;
    }

    const raw = this.commissionForm.getRawValue();
    const amount = raw.amount;
    if (amount == null || Number.isNaN(Number(amount))) {
      return;
    }

    this.submittingCommission = true;
    this.http
      .post<CommissionWithdrawalRow>(`${apiURL}/commission-withdrawal/request`, {
        amount: Number(amount),
        user_note: (raw.user_note ?? '').trim(),
      })
      .subscribe({
        next: () => {
          this.submittingCommission = false;
          this.toastr.success(
            'Solicitud registrada. El equipo la revisará antes de la transferencia.',
            'Retiro de ganancias',
            { timeOut: 6000, closeButton: true, positionClass: 'toast-top-right' },
          );
          this.commissionForm.reset({ amount: null, user_note: '' });
          this.refreshBalancesAndRequests();
        },
        error: (err) => {
          console.error(err);
          this.submittingCommission = false;
          this.toastr.error(this.extractErrorDetail(err), 'Retiro de ganancias', {
            timeOut: 8000,
            closeButton: true,
            positionClass: 'toast-top-right',
          });
        },
      });
  }

  requestPointsWithdrawal(): void {
    if (this.pointsForm.invalid || this.submittingPoints) {
      this.pointsForm.markAllAsTouched();
      return;
    }

    const raw = this.pointsForm.getRawValue();
    const amount = raw.amount;
    if (amount == null || Number.isNaN(Number(amount))) {
      return;
    }
    const pts = Math.floor(Number(amount));
    if (pts < 1) {
      this.pointsForm.get('amount')?.setErrors({ min: true });
      return;
    }

    this.submittingPoints = true;
    this.http
      .post<PointsWithdrawalRow>(`${apiURL}/points-withdrawal/request`, {
        amount: pts,
        user_note: (raw.user_note ?? '').trim(),
      })
      .subscribe({
        next: () => {
          this.submittingPoints = false;
          this.toastr.success(
            'Solicitud registrada. El equipo la revisará antes de la transferencia.',
            'Retiro de puntos',
            { timeOut: 6000, closeButton: true, positionClass: 'toast-top-right' },
          );
          this.pointsForm.reset({ amount: null, user_note: '' });
          this.refreshBalancesAndRequests();
        },
        error: (err) => {
          console.error(err);
          this.submittingPoints = false;
          this.toastr.error(this.extractErrorDetail(err), 'Retiro de puntos', {
            timeOut: 8000,
            closeButton: true,
            positionClass: 'toast-top-right',
          });
        },
      });
  }

  private extractErrorDetail(err: unknown): string {
    const body = (err as { error?: unknown })?.error;
    let detail = 'No se pudo registrar la solicitud.';
    if (body && typeof body === 'object' && 'detail' in body && typeof (body as { detail: string }).detail === 'string') {
      detail = (body as { detail: string }).detail;
    } else if (body && typeof body === 'object') {
      const first = Object.values(body as Record<string, unknown>).find(
        (v) => Array.isArray(v) && v.length && typeof (v as string[])[0] === 'string',
      ) as string[] | undefined;
      if (first?.[0]) {
        detail = first[0];
      }
    }
    return detail;
  }
}
