import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  login(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  // optionally: save token to localStorage
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  saveUser(user: any) {
  localStorage.setItem('user', JSON.stringify(user));
}

getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

  signup(signupData: any) {
  return this.http.post<any>('http://localhost:3000/api/signup', signupData);
}

isLoggedIn() {
  console.log(!!localStorage.getItem('token'));
  return !!localStorage.getItem('token');
  // return false;
}


}
