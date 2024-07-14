import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  apiUrl: string = 'http://localhost:8080/api/teachers';

  constructor(private _http: HttpClient) {}

  getTeachers() {
    return this._http.get<Teacher[]>(this.apiUrl);
  }
}
