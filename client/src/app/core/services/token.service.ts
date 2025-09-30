import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private tokenKey = 'auth_token';

  setToken(token: string): void {
    if (token) localStorage.setItem(this.tokenKey, token);
    else localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clear() {
    localStorage.removeItem(this.tokenKey);
  }
}
