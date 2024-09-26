import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GradesService {
  baseUrl: string = 'http://localhost:5000/api/grade/';

  constructor(private _http: HttpClient) {}

  updateGrades(gradesData: any): Observable<any> {
    return this._http.post(this.baseUrl + 'update-grades', gradesData);
  }
}
