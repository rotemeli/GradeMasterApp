import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl: string = 'http://localhost:5000/api/teachers/';
  currentUser = signal<User | null>(null);
  loadingUser = signal<boolean>(true);

  constructor(private _http: HttpClient) {}

  get teacherName(): string {
    const name =
      this.currentUser()?.firstName + ' ' + this.currentUser()?.lastName;
    return name;
  }

  get teacherId() {
    return this.currentUser()?.id;
  }

  register(model: any) {
    return this._http.post(this.baseUrl + 'register', model);
  }

  login(model: any) {
    return this._http.post<User>(this.baseUrl + 'login', model).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  loadCurrentUser() {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    this.currentUser.set(user);
    this.loadingUser.set(false);
  }
}
