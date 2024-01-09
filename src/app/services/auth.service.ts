import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  setAccessToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearAccessToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

  constructor() {
  }
}
