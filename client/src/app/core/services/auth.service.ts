// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../../environment/environment';
import { AuthResponse } from '../models/authResponse';
import { LoginDto } from '../models/loginDto';
import { RegisterDto } from '../models/registerDto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, dto, { withCredentials: true }).pipe(
      tap(res => {
        if (res?.token) this.tokenService.setToken(res.token);
        if (res?.user) this.currentUserSubject.next(res.user);
      })
    );
  }

  register(dto: RegisterDto) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, dto);
  }

  refreshToken() {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(tap(res => { if (res?.token) this.tokenService.setToken(res.token); }));
  }

  logout() {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(tap(() => {
        this.tokenService.clear();
        this.currentUserSubject.next(null);
      }));
  }

  isLoggedIn(): boolean {
    const token = this.tokenService.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  }
}
