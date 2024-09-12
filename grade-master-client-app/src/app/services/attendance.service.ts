import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAttendanceData } from '../models/attendance.model';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  baseUrl: string = 'http://localhost:5000/api/attendance/';

  constructor(private _http: HttpClient) {}

  updateAttendance(attendanceData: IAttendanceData[][]): Observable<any> {
    return this._http.post(this.baseUrl + 'update-attendance', attendanceData);
  }
}
