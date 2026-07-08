// Create this file: src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TOKEN_KEY } from '../shared/constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/User';

  constructor(private http: HttpClient) { }

  // Login method
  login(emailId: string, password: string): Observable<any> {
    const loginData = { emailId, password };
    return this.http.post(`${this.apiUrl}/Login`, loginData);
  }


  // Get users (protected endpoint)
  getUsers(): Observable<any> {
    const userAppData = localStorage.getItem('userApp');
    if (!userAppData) throw new Error('No user data found');
    
    const userData = JSON.parse(userAppData);
    const token = userData.token;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/getUsers`, { headers });
  }

  // Utility methods
  getToken(): string | null {
    const userAppData = localStorage.getItem('userApp');
    if (userAppData) {
      const userData = JSON.parse(userAppData);
      return userData.token;
    }
    return null;
  }

  saveToken(userApp:string){
    localStorage.setItem(TOKEN_KEY, userApp);
  }
  DeleteToken() {
    localStorage.removeItem(TOKEN_KEY);
  }
  

  isLoggedIn(): boolean {
    const tokenDataString = localStorage.getItem(TOKEN_KEY);
    if (!tokenDataString) return false;
    try {
      const tokenData = JSON.parse(tokenDataString);
      const token = tokenData.token;
      if (!token) return false;

      // Decode JWT Payload
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      // Check expiry
      if (payload.exp) {
        const expiryDate = new Date(payload.exp * 1000);
        return expiryDate > new Date(); // True if not expired
      }
      
      return true;
    } catch {
      return false;
    }
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload["role"] || null;
    } catch {
      return null;
    }
  }
}
