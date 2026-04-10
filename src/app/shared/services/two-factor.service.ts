import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiURL = environment.apiURL;

export interface TwoFactorSetupResponse {
  otpauth_uri: string;
  manual_entry_key: string;
}

@Injectable({
  providedIn: 'root'
})
export class TwoFactorService {

  constructor(private http: HttpClient) { }

  setup(): Observable<TwoFactorSetupResponse> {
    return this.http.post<TwoFactorSetupResponse>(`${apiURL}/profile/2fa/setup/`, {});
  }

  confirm(otp: string): Observable<{ detail?: string; two_factor_enabled?: boolean }> {
    return this.http.post(`${apiURL}/profile/2fa/confirm/`, { otp: String(otp).trim() });
  }

  disable(password: string, otp: string): Observable<{ detail?: string }> {
    return this.http.post(`${apiURL}/profile/2fa/disable/`, {
      password,
      otp: String(otp).trim(),
    });
  }
}
