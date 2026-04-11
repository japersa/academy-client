import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/core/services/user-data.service';
import {
  LiveSignalAdminPayload,
  LiveSignalService,
} from 'src/app/shared/services/live-signal.service';

@Component({
  selector: 'app-live-signal-admin',
  templateUrl: './live-signal-admin.component.html',
  styleUrls: ['./live-signal-admin.component.scss'],
})
export class LiveSignalAdminComponent implements OnInit {
  loading = true;
  saving = false;
  private configLoaded = false;
  form!: FormGroup;

  readonly minOptions: { value: string; label: string }[] = [
    { value: 'none', label: 'Cualquier usuario logueado' },
    { value: 'basic', label: 'Suscripción básica o superior' },
    { value: 'full', label: 'Suscripción completa' },
  ];

  constructor(
    private fb: FormBuilder,
    private liveSignalService: LiveSignalService,
    private userDataService: UserDataService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.form = this.fb.group({
      is_live: [false],
      title: ['', Validators.required],
      stream_url: [''],
      min_subscription: ['none'],
    });
  }

  ngOnInit(): void {
    this.userDataService.userData$.subscribe((user) => {
      if (!user) {
        return;
      }
      if (user.rol !== 'admin') {
        this.router.navigate(['/referrals']);
        return;
      }
      if (this.configLoaded) {
        return;
      }
      this.configLoaded = true;
      this.liveSignalService.getAdmin().subscribe({
        next: (data: LiveSignalAdminPayload) => {
          this.form.patchValue({
            is_live: data.is_live,
            title: data.title,
            stream_url: data.stream_url,
            min_subscription: data.min_subscription,
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.toastr.error('No se pudo cargar la configuración.', 'Error');
        },
      });
    });
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    const v = this.form.value;
    this.liveSignalService
      .saveAdmin({
        is_live: v.is_live,
        title: v.title,
        stream_url: (v.stream_url || '').trim(),
        min_subscription: v.min_subscription,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.toastr.success('Configuración guardada.', 'Listo');
        },
        error: () => {
          this.saving = false;
          this.toastr.error('No se pudo guardar.', 'Error');
        },
      });
  }
}
