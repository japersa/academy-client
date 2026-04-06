import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/shared/services/user.service';

const apiURL = environment.apiURL.replace(/\/$/, '');

export interface CommissionWithdrawalRow {
  id: number;
  amount: string;
  status: string;
  user_note: string;
  created_at: string;
}

@Component({
  selector: 'app-withdrawals',
  templateUrl: './withdrawals.component.html',
  styleUrls: ['./withdrawals.component.scss']
})
export class WithdrawalsComponent implements OnInit {
  commissionBalance: number = 0;
  loadingBalance = true;
  submitting = false;
  requests: CommissionWithdrawalRow[] = [];

  form = this.fb.group({
    amount: [
      null as number | null,
      [Validators.required, Validators.min(0.01)],
    ],
    user_note: ['', [Validators.maxLength(2000)]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.refreshBalancesAndRequests();
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

  /** Clases Bootstrap para badge según estado (legible sobre fondo claro del card). */
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
        this.loadingBalance = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingBalance = false;
        this.toastr.error('No se pudo cargar el saldo de ganancias.', 'Retiros');
      },
    });

    this.http.get<CommissionWithdrawalRow[]>(`${apiURL}/commission-withdrawal/my`).subscribe({
      next: (rows) => {
        this.requests = Array.isArray(rows) ? rows : [];
      },
      error: (err) => {
        console.error(err);
        this.requests = [];
      },
    });
  }

  requestWithdrawal(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const amount = raw.amount;
    if (amount == null || Number.isNaN(Number(amount))) {
      return;
    }

    this.submitting = true;
    this.http
      .post<CommissionWithdrawalRow>(`${apiURL}/commission-withdrawal/request`, {
        amount: Number(amount),
        user_note: (raw.user_note ?? '').trim(),
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.toastr.success(
            'Solicitud registrada. El equipo la revisará antes de la transferencia.',
            'Solicitud de retiro',
            { timeOut: 6000, closeButton: true, positionClass: 'toast-top-right' },
          );
          this.form.reset({ amount: null, user_note: '' });
          this.refreshBalancesAndRequests();
        },
        error: (err) => {
          console.error(err);
          this.submitting = false;
          const body = err?.error;
          let detail = 'No se pudo registrar la solicitud.';
          if (typeof body?.detail === 'string') {
            detail = body.detail;
          } else if (body && typeof body === 'object') {
            const first = Object.values(body).find(
              (v) => Array.isArray(v) && v.length && typeof v[0] === 'string',
            ) as string[] | undefined;
            if (first?.[0]) {
              detail = first[0];
            }
          }
          this.toastr.error(detail, 'Solicitud de retiro', {
            timeOut: 8000,
            closeButton: true,
            positionClass: 'toast-top-right',
          });
        },
      });
  }
}
